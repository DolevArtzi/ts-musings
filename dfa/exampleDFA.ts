import { DFA } from './dfa';
import { State } from './dfa';
import { Delta } from './dfa';
import { Alphabet } from './dfa';
import { Transition } from './dfa';

const language_desc = "strings that end with a 0 and empty string";

//set of states
let Q = new Set<State>();
let q0 = {name:0}; //initial state
let q1 = {name:1};
Q.add(q0).add(q1);

let f = new Set<State>() //set of accepting states
f.add(q0);

//set of rules, represents the transition function
let delta : Delta = new Set<Transition>();
let r1 : Transition = [q0,'0',q0];
let r2 : Transition = [q0,'1',q1];
let r3 : Transition = [q1,'1',q1];
let r4 : Transition = [q1,'0',q0];
delta.add(r1).add(r2).add(r3).add(r4);

//Alphabet
let S : Alphabet = new Set<string>();
S.add('1');
S.add('0');

let d = new DFA(Q, S,delta,q0,f,language_desc);

d.addRule([q0,'1',{name:3}]); //invalid rule
d.eval('010101110'); //1
d.eval('01010111'); //0
d.eval(''); //1
d.eval('1'); //0