type State = {
    name: number | string;
}

type Alphabet = Set<string>;
type Transition = [State,string,State];
type Delta = Array<Transition>;

class DFA {
    private Q;
    private S;
    private d;
    private q0;
    private F;
    private name;

    print () {
        console.log(`printing ....... ${this.name}`);
        console.log(`Q ${this.Q}, S ${this.S}, d ${this.d}, q0 ${this.q0}, F ${this.F}`);
    }

    transitionString(t : Transition) {
        return "s" + t[0].name + ", '" + t[1] + "' --> " + " s" + t[2].name;
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
            this.d.push(t);
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
        this.d.forEach(rule => {
            const q1 = rule[0];
            const c2 = rule[1];
            if (c === c2 && curr.name === q1.name) newState = rule[2]; 
        });
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
        if (w === "") {
            const res = this.F.has(curr);
            console.log(`${res ? "ACCEPT" : "REJECT"}`);
            return res;
        }

        const newState = this.stepState(w[0],curr);
        return this._eval(w.substring(1),newState);
    }

    eval(w : string) {
        if (!this.validateString(w)) return;
        return this._eval(w,this.q0);
    }
}

let s = new Set<State>()
let f = new Set<State>()
let q0 = {name:0};
let delta : Delta = [];
f.add(q0);
let q1 = {name:1}
s.add(q0);
s.add(q1);
let S : Alphabet = new Set<string>();
S.add('1');
S.add('0');
let d = new DFA(s, S,[],q0,f,"strings that end with a 0 and empty string");
d.addRule([q0,'0',q0]);
d.addRule([q0,'1',q1]);
d.addRule([q1,'1',q1]);
d.addRule([q1,'0',q0]);
d.addRule([{name:3},'2',q0]);
d.eval('010101110');
d.eval('01010111');
d.eval('');
d.eval('1');



