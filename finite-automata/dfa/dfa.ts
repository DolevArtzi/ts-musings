import { SetOp } from './setHelper';
type internal1 = (number | string)
type internal = internal1 | [internal1,internal1]
export type State = {
    name : internal | [internal,internal] | [internal,internal,internal,internal]
}

export type Alphabet = Set<string>;
export type Transition = [State,string,State];
export type Delta = Set<Transition> //| ((State,string) => State);
type arrSet<T> = Array<T> | Set<T>;
const break_string = '_________________________________________________________________________________________';
export class DFA {
    Q;
    S;
    d : Delta;
    q0;
    F;
    name;

    print () {
        console.log(break_string);
        console.log(`DFA: ${this.name}`);
        console.log(`Q: ${this.statesString(this.Q)}`);
        console.log(`Alphabet: ${this.alphabetString(this.S)}`);
        console.log(`Transition Function: ${this.deltaString(this.d)}`);
        console.log(`Starting State: ${this.stateString(this.q0)}`);
        console.log(`Accepting States: ${this.statesString(this.F)}`);
        console.log(break_string);
    }

    private deltaString(d : Delta) {
        return this.printArrSet(d,this.transitionString);
    }

    private stateString(q : State) : string {
        return "s" + q.name;
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
        return "{(s" + t[0].name + ", '" + t[1] + "') --> " + " s" + t[2].name + "}";
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

    validateDelta(d : Delta) {
        let transitionArr = d.values();
        for (const t of transitionArr) {
            if (!this.validateTransition(t)) return false;
        }
        return true;
    }

    complement() : DFA {
        return new DFA(
            this.Q,this.S,this.d,this.q0,SetOp.difference(this.Q,this.F),`complement of DFA: ${this.name}`
        );
    }

    //assumes S1 = S2
    // union(D2 : DFA) {
    //     let q0z = D2.q0;
    //     let Qz = D2.Q;
    //     let Fz = D2.F;
    //     let namez = D2.name;

    //     let Q_n = SetOp.cartesianProduct(this.Q,Qz);
    //     let d_n = ([q,q_],w) => [this.stepState(w,q),D2.stepState(w,q_)];
    //     let q0_n = [this.q0,q0z];
    //     let F_n = SetOp.union(SetOp.cartesianProduct(this.Q,Fz),SetOp.cartesianProduct(this.F,Qz));
    //     return new DFA(
    //         Q_n,this.S,
    //     )
    // }
    
    addRule(t : Transition) {
        if (this.validateTransition(t)) this.d.add(t);
    }

    constructor(Q : Set<State>, S : Alphabet, d : Delta, q0 : State, F : Set<State>, name? : string) {
        this.Q = Q;
        this.S = S;
        this.validate(Q,S,d,q0,F);
        this.d = d;
        this.q0 = q0;
        this.F = F;
        this.name = name;
        this.print();
    }

    validate(Q: Set<State>, S: Alphabet, d: Delta, q0: State, F: Set<State>) {
        const invalid = (message? : string) => { throw new TypeError(message); };

        F.forEach(state => {
            if (!Q.has(state)) {
                invalid('state in F not in Q');
            }
        });

        if (!Q.has(q0)) {
            invalid('starting state not in Q');
        }

        if (!this.validateDelta(d)) {
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
    protected stepState(c : string, curr : State) : State {
        let newState = undefined;
        let transitionArr = this.d.values();

        for (const rule of transitionArr) {
            const q1 = rule[0];
            const c2 = rule[1];
            if (c === c2 && curr.name === q1.name) newState = rule[2]; 
        }

        if (newState === undefined) throw new TypeError('undefined transition');
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

        const newState = this.stepState(w[0],curr);
        return this._eval(w.substring(1),newState);
    }

    eval(w : string) {
        if (!this.validateString(w)) return;
        const res = this._eval(w,this.q0);
        // console.log(`${w === "" ? "''" : w} ${res ? "ACCEPTED" : "REJECTED"}`);
        return res;
    }
}



