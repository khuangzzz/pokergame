import { PokerParser } from './cards';
import { CARD_RANKS } from './constants';
import { Hands } from './hand';

export class PokerEvaluator {
    parser: PokerParser;
    results: Hands[];

    constructor(handsSet: { [key: string]: string }) {
        this.parser = new PokerParser();
        const handpairs = Object.values(handsSet).map(
            handSet => handSet.split(' ').map(hand => [...hand].sort((a, b) => CARD_RANKS[a] >= CARD_RANKS[b] ? 1 : 0).join('').toUpperCase())
        );
        this.results = this.evaluate(handpairs);
    }

    evaluate(handpairs: string[][]) {
        return handpairs.map(handpair => new Hands(handpair.map(hand => this.parser.doEvaluation(hand))));
    }

    outputResult() {
        return this.results.forEach(result => console.log(result.toString()));
    }
}
