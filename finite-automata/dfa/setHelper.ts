export class SetOp {
    constructor() {}

    static difference(A : Set<any>, B : Set<any>) : Set<any> {
        return new Set(
            [...A].filter(x => !B.has(x))
        );
    }

    static union(A : Set<any>, B : Set<any>) : Set<any> {
        return new Set(
            [...A,...B]
        );
    }

    static intersection(A : Set<any>, B : Set<any>) : Set<any> {
        return new Set(
            [...A].filter(x => B.has(x))
        );
    }

    private static _combineElem<T1,T2>(e : T1, B : Array<T2>) : Set<[T1,T2]> {
        let res = new Set<[T1,T2]>();
        const l = B.length;
        for (let i = 0; i < l; i++) {
            const e2 = B[i];
            res.add([e,e2]);
        }
        return res;
    }

    static cartesianProduct<T1,T2>(A : Set<T1>, B : Set<T2>) : Set<[T1,T2]> {
        const A_arr : Array<T1> = [...A];
        const B_arr : Array<T2> = [...B];
        let res = new Set<[T1,T2]>();
        const l = A_arr.length;

        for (let i = 0; i < l; i++) {
            const e = A_arr[i];
            const s : Set<[T1,T2]> = SetOp._combineElem<T1,T2>(e,B_arr);
            res = SetOp.union(res,s);
        }
        console.log(A,B,res);
        return res;
    }
}