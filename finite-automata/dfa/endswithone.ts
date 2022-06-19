import { BasicDFA,State,Alphabet,Transition, Rules } from './dfa';

const language_desc = "binary strings ending in a '1'";

//set of states
let Q = new Set<State>();
let q0 = 0; //initial state
let q1 = 1;
Q.add(q0).add(q1);

let f = new Set<State>(); //set of accepting states
f.add(q1);

//set of rules, represents the transition function
let delta : Rules = new Set<Transition>();
let r1 : Transition = [q0,'0',q0]
let r2 : Transition = [q1,'1',q1];
let r3 : Transition = [q1,'0',q0];
let r4 : Transition = [q0,'1',q1];
delta.add(r1).add(r2).add(r3).add(r4);

//Alphabet
let S : Alphabet = new Set<string>();
S.add('1');
S.add('0');

let d = new BasicDFA(Q, S,delta,q0,f,language_desc);

// d.addRule([q0,'1',3]); //invalid rule

let z = ['010101110','01010111','','1','000000000000010101011010'];
for(let i = 0; i < 5; i++) {
    console.log(z[i],d.eval(z[i]));
}

let s1 = new Set([0,1]);
let s2 = new Set(['0','1']);
// let cp = SetOp.cartesianProduct(s1,s2);