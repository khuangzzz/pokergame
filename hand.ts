import { EvaluatedHand, RANK } from "./constants";

export class Hands {
    handA: EvaluatedHand;
    handB: EvaluatedHand;
    result: string;

    constructor(hands: EvaluatedHand[]) {
        [this.handA, this.handB] = hands;
        this.result = this.compare();
    }

    compare(): string {
        if (this.handA.rank.valueOf() > this.handB.rank.valueOf()) {
            return 'a';
        }
        if (this.handA.rank.valueOf() < this.handB.rank.valueOf()) {
            return 'b';
        }
        return this.deepCompare();
    }

    deepCompare(): string {
        for (let i = 0; i < this.handA.keyIndetifier.length; i++) {
            if (this.handA.keyIndetifier[i] < this.handB.keyIndetifier[i]) {
                return 'b';
            }
            if (this.handA.keyIndetifier[i] > this.handB.keyIndetifier[i]) {
                return 'a';
            }
        }
        return 'ab';
    }

    toString(): string {
        return `${RANK[this.handA.rank]} ${RANK[this.handB.rank]} ${this.result}`;
    }
}
