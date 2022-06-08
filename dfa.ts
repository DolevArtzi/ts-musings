type State = {
    name: number | string;
}

type NonEmptyArray<T> = [T,...T[]];

type Alphabet = NonEmptyArray<string>;
type Delta = Array<string>;

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
}
let s = new Set<State>()
let f = new Set<State>()
let q0 = {name:0}
s.add(q0)
let d = new DFA(s, ['1','0'],['a'],q0,f,'first DFA');
