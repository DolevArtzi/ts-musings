import { SetOp } from './setHelper';
export type State = string | number | State[];
export type Alphabet = Set<string>;
export type Transition = [State,string,State];
type Rules = Set<Transition>;
type arrSet<T> = Array<T> | Set<T>;
const break_string = '_________________________________________________________________________________________';
export abstract class AbstractDFA {
    Q : Set<State>;
    S : Alphabet;
    rules : Rules;
    q0 : State;
    F : Set<State>;
    name : string | undefined;

    print () {
        console.log(break_string);
        console.log(`DFA: ${this.name}`);
        console.log(`Q: ${this.statesString(this.Q)}`);
        console.log(`Alphabet: ${this.alphabetString(this.S)}`);
        console.log(`Transition Function: ${this.rulesString(this.rules)}`);
        console.log(`Starting State: ${this.stateString(this.q0)}`);
        console.log(`Accepting States: ${this.statesString(this.F)}`);
        console.log(break_string);
    }

    private rulesString(rules : Rules) {
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

    validateStates(states : State[], Q? : Set<State>) { //TODO: deal with Q (test)
        let v = true;
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

    validateRule(rules : Rules) {
        let transitionArr = rules.values();
        for (const t of transitionArr) {
            if (!this.validateTransition(t)) return false;
        }
        return true;
    }
    
    addRule(t : Transition) {
        if (this.validateTransition(t)) this.rules.add(t);
    }

    constructor(Q : Set<State>, S : Alphabet, rules : Rules, q0 : State, F : Set<State>, name? : string) {
        this.Q = Q;
        this.S = S;
        this.validate(Q,S,rules,q0,F);
        this.rules = rules;
        this.q0 = q0;
        this.F = F;
        this.name = name;
        this.print();
    }

    validate(Q: Set<State>, S: Alphabet, rules: Rules, q0: State, F: Set<State>) {
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

    protected abstract delta(curr : State, c : string) : State; 

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

        const newState = this.delta(curr,w[0]);
        return this._eval(w.substring(1),newState);
    }

    eval(w : string) {
        if (!this.validateString(w)) return;
        const res = this._eval(w,this.q0);
        return res;
    }
}

export class BasicDFA extends AbstractDFA {
    /**
    *
    * @param c - a character, which should be in the alphabet
    * @param curr - starting state before reading @param c
    * @returns the state that is transitioned to by reading @param c
    * @throws {TypeError} if there is no rule to transition @param c from 
    *                     @param curr
    */
    protected delta(curr: State, c: string): State {
        let newState = undefined;
        let transitionArr = this.rules.values();

        for (const rule of transitionArr) {
            const q1 = rule[0];
            const c2 = rule[1];
            if (c === c2 && curr === q1) newState = rule[2]; 
        }

        if (newState === undefined) throw new TypeError('undefined transition');
        return newState;
    }
}



