import { throws } from "assert";

type State = {
    name: number | string;
}

type Alphabet = Set<string>;
type Transition = [State,string,State];
type Delta = Set<Transition>;
type arrSet<T> = Array<T> | Set<T>;

class DFA {
    private Q;
    private S;
    private d;
    private q0;
    private F;
    private name;

    print () {
        console.log('_________________________________________________________________________________________');
        console.log(`DFA: ${this.name}`);
        console.log(`Q: ${this.statesString(this.Q)}`);
        console.log(`Alphabet: ${this.alphabetString(this.S)}`);
        console.log(`Transition Function: ${this.deltaString(this.d)}`);
        console.log(`Starting State: ${this.stateString(this.q0)}`);
        console.log(`Accepting States: ${this.statesString(this.F)}`);
        console.log('_________________________________________________________________________________________');
        // console.log(`Q ${this.statesString(this.Q)}, S ${this.alphabetString(S)}, d ${this.printArrSet(this.d,this.transitionString)}, q0 ${this.stateString(this.q0)}, F ${this.statesString(this.F)}`);
    }

    private deltaString(d : Delta) {
        return this.printArrSet(d,this.transitionString);
    }

    private stateString(q : State) : string {
        return "s" + q.name;
    }

    private printArrSet(set : arrSet<any>, f : (arg0 : any) => string) {
        let iter = set.values();
        let r = "{"
        for (const x of iter) {
            r += f(x) + ",";
        }
        return r.substring(0,r.length-1) + "}"
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

    validateStates(...states : State[]) {
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
    
    addRule(t : Transition) {
        const q1 = t[0];
        const s = t[1];
        const q2 = t[2];
        const validStates = this.validateStates(q1,q2);
        const validStr = this.S.has(s);
        if (validStates && validStr) {
            this.d.add(t);
            console.log(`added rule: ${this.transitionString(t)}`);
        } else {
            console.log(`invalid rule: ${this.transitionString(t)} ${validStates ? "" : "[unrecognized state(s)]"} ${validStr ? "" : " [str not in alphabet]"}`);
        }
    }

    constructor(Q : Set<State>, S : Alphabet, d : Delta, q0 : State, F : Set<State>, name? : string) {
        this.validate(Q,S,d,q0,F);
        this.Q = Q;
        this.S = S;
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
    }

    /**
     * 
     * @param c - a character, which should be in the alphabet
     * @param curr - starting state before reading @param c
     * @returns the state that is transitioned to by reading @param c
     * @throws {TypeError} if there is no rule to transition @param c from 
     *                     @param curr
     */
    private stepState(c : string, curr : State) : State {
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
        console.log(`${w} ${res ? "ACCEPTED" : "REJECTED"}`);
        return res;
    }
}

let Q = new Set<State>()
let f = new Set<State>()
let q0 = {name:0};
let delta : Delta = new Set<Transition>();
f.add(q0);
let q1 = {name:1}
Q.add(q0);
Q.add(q1);
let S : Alphabet = new Set<string>();
S.add('1');
S.add('0');
let r1 : Transition = [q0,'0',q0];
let r2 : Transition = [q0,'1',q1];
let r3 : Transition = [q1,'1',q1];
let r4 : Transition = [q1,'0',q0];
delta.add(r1).add(r2).add(r3).add(r4);
let d = new DFA(Q, S,delta,q0,f,"strings that end with a 0 and empty string");
d.addRule([q0,'1',{name:3}]);
d.eval('010101110');
d.eval('01010111');
d.eval('');
d.eval('1');



