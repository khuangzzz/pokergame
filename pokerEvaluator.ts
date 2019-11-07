import { PokerParser } from './cards';
import { CARD_RANKS } from './constants';
import { Hands } from './hand';

type TwoHands = string[][];

export class PokerEvaluator {
    parser: PokerParser;
    results: Hands[];

    constructor(handsSet: string[]) {
        this.parser = new PokerParser();
        const handpairs = this.preProcess(handsSet);
        this.results = this.evaluate(handpairs);
        this.outputResult();
    }

    preProcess(handsSetValues: string[]): TwoHands {
        const computation = (hand) => 
            [...hand].sort((a, b) => {
                return CARD_RANKS[a] - CARD_RANKS[b];
            }).join('').toUpperCase()
        const result = handsSetValues.map(handSet => 
            handSet.toUpperCase().split(' ').map(hand => 
                computation(hand)
            )
        );
        return result;
    }

    evaluate(handpairs: TwoHands): Hands[] {
        return handpairs.map(handpair => new Hands(handpair.map(hand => this.parser.doEvaluation(hand))));
    }

    outputResult(): void {
        this.results.forEach(result => console.log(result.toString()));
    }
}
