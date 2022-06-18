import { SetOp } from './setHelper';
export type State = string | number | State[];
export type Alphabet = Set<string>;
export type Transition = [State,string,State];
type Rule = Set<Transition>;
export type TransitionF = (q : State,c : string) => State;
type arrSet<T> = Array<T> | Set<T>;
const break_string = '_________________________________________________________________________________________';
export class DFA {
    Q;
    S;
    rules : Rule;
    protected transition_func : (q : State,c : string) => State;
    q0;
    F;
    name;

    print () {
        console.log(break_string);
        console.log(`DFA: ${this.name}`);
        console.log(`Q: ${this.statesString(this.Q)}`);
        console.log(`Alphabet: ${this.alphabetString(this.S)}`);
        console.log(`Transition Function: ${this.deltaString(this.rules)}`);
        console.log(`Starting State: ${this.stateString(this.q0)}`);
        console.log(`Accepting States: ${this.statesString(this.F)}`);
        console.log(break_string);
    }

    private deltaString(rules : Rule) {
        return this.printArrSet(rules,this.transitionString);
    }

    private stateString(q : State) : string {
        return "s" + `${q}`;
    }

    private printArrSet(set : arrSet<any>, f : (arg0 : any) => string) {
        let iter = set.values();
        let r = "{";
        for (const x of iter) {
            r += f(x) + ",";
        }
        return r.substring(0,r.length-1) + "}";
    }

    private statesString(Q : Set<State>) : string {
        return this.printArrSet(Q,this.stateString);
    }

    private alphabetString(S : Alphabet) {
        return this.printArrSet(S,(x) => "'" + x + "'");
    }

    private transitionString(t : Transition) {
        return "{(s" + `${t[0]}` + ", '" + t[1] + "') --> " + " s" + `${t[2]}` + "}";
    }

    validateStates(states : State[], Q? : Set<State>) {
        let v = true;
        const Q_true = !!Q ? Q : this.Q;
        states.forEach(state => {
            if (!this.Q.has(state)) v = false;
        });
        return v;
    }

    /**
     * Check that every char in @param w is in the alphabet
     * @param w 
     * @returns true if every char in @param w is in S, false otherwise
     */
    validateString(w : string) : boolean {
        if (w == "") return true;
        if (this.S.has(w[0])) {
            return this.validateString(w.substring(1));
        } else return false;
    }

    validateTransition(t : Transition) : boolean {
        const q1 = t[0];
        const s = t[1];
        const q2 = t[2];
        const validStates = this.validateStates([q1,q2]);
        const validStr = this.S.has(s);
        if (validStates && validStr) {
            console.log(`added rule: ${this.transitionString(t)}`);
            return true
        } else {
            console.log(`invalid rule: ${this.transitionString(t)} ${validStates ? "" : "[unrecognized state(s)]"} ${validStr ? "" : " [str not in alphabet]"}`);
            return false;
        }
    }

    validateRule(rules : Rule) {
        let transitionArr = rules.values();
        for (const t of transitionArr) {
            if (!this.validateTransition(t)) return false;
        }
        return true;
    }

    complement() : DFA {
        return new DFA(
            this.Q,this.S,this.rules,this.q0,SetOp.difference(this.Q,this.F),`complement of DFA: ${this}`
        );
    }

    // assumes S1 = S2
    // union(D2 : DFA) {
    //     let q0z = D2.q0;
    //     let Qz = D2.Q;
    //     let Fz = D2.F;
    //     let namez = D2.name;

    //     let Q_n = SetOp.cartesianProduct(this.Q,Qz);
    //     let transition_func_n = ([q,q_],w) => [this.transition_func(q,w),D2.transition_func(q_,w)];
    //     let q0_n = [this.q0,q0z];
    //     let F_n = SetOp.union(SetOp.cartesianProduct(this.Q,Fz),SetOp.cartesianProduct(this.F,Qz));
    //     let new_transition_func = 

    //     return new DFA(
    //         Q_n,this.S,null,q0_n,F_n,`union of ${this.name} and ${D2.name}`
    //     );
    // }
    
    addRule(t : Transition) {
        if (this.validateTransition(t)) this.rules.add(t);
    }

    constructor(Q : Set<State>, S : Alphabet, rules : Rule, q0 : State, F : Set<State>, name? : string) {
        this.Q = Q;
        this.S = S;
        this.validate(Q,S,rules,q0,F);
        this.rules = rules;
        this.transition_func = this.delta;
        this.q0 = q0;
        this.F = F;
        this.name = name;
        this.print();
    }

    validate(Q: Set<State>, S: Alphabet, rules: Rule, q0: State, F: Set<State>) {
        const invalid = (message? : string) => { throw new TypeError(message); };

        F.forEach(state => {
            if (!Q.has(state)) {
                invalid('state in F not in Q');
            }
        });

        if (!Q.has(q0)) {
            invalid('starting state not in Q');
        }

        if (!this.validateRule(rules)) {
            invalid('invalid transition function');
        }
    }

    /**
     * 
     * @param c - a character, which should be in the alphabet
     * @param curr - starting state before reading @param c
     * @returns the state that is transitioned to by reading @param c
     * @throws {TypeError} if there is no rule to transition @param c from 
     *                     @param curr
     */
    protected delta(curr : State, c : string) : State {
        let newState = undefined;
        let transitionArr = this.rules.values();

        for (const rule of transitionArr) {
            const q1 = rule[0];
            const c2 = rule[1];
            if (c === c2 && curr === q1) newState = rule[2]; 
        }

        if (newState === undefined) throw new TypeError('undefined transition');
        // if (newState !== undefined) console.log("NOT NULL");
        return newState;
    }

    /**
     * evaluate @param w being fed to the DFA starting at 
     * state @param curr.
     * @param w 
     * @param curr
     * @returns if @param w is "", returns whether @param curr is an
     * accepting state
     */
    private _eval(w : string, curr : State) : boolean {
        if (w === "") return this.F.has(curr);

        const newState = this.transition_func(curr,w[0]);
        return this._eval(w.substring(1),newState);
    }

    eval(w : string) {
        if (!this.validateString(w)) return;
        const res = this._eval(w,this.q0);
        // console.log(`${w === "" ? "''" : w} ${res ? "ACCEPTED" : "REJECTED"}`);
        return res;
    }
}



