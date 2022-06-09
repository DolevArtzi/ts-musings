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

    validateStates(...states : State[]) {
        let v = true;
        states.forEach(state => {
            if (!this.Q.has(state)) v = false;
        });
        return v;
    }
    
    validateString(w : string) {
        if (w == "") return true;
        if (this.S.has(w[0])) {
            return this.validateString(w.substring(1));
        } else return false;
    }
    
// validateStates(...states State[]) : boolean {
//         return true;
//     }

    addRule(t : Transition) {
        const Q1 = t[0];
        const s = t[1];
        const Q2 = t[2];
        if (this.validateStates(Q1,Q2)) {
            this.d.push(t);
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

    eval(w : string) {
        if (this.validateString(w)) {
            
        }
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
let d = new DFA(s, new Set(...'1','0'),[],q0,f,"strings that end with a 0 and empty string");
d.addRule([q0,'0',q0]);
d.addRule([q0,'1',q1]);
d.addRule([q1,'1',q1]);
d.addRule([q1,'0',q0]);


