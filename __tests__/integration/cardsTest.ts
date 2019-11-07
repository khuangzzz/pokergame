import { PokerParser } from "../../cards";
import { RANK } from "../../constants";

describe('PokerParser', () => {
    const pokerParser = new PokerParser();
    let testCasesWithoutJoker: { type: RANK, hands: string, keyIdentifier?: number[] }[];
    let testCasesWithJoker: { type: RANK, hands: string, keyIdentifier?: number[] }[];

    this.handyExpect = (testCase) => {
        const result = pokerParser.doEvaluation(testCase.hands);
        expect(result.rank).toEqual(testCase.type);
        expect(result.keyIdentifier).toEqual(testCase.keyIdentifier);
    }

    beforeAll(() => {
        testCasesWithoutJoker = [
            { type: RANK.FOUROFAKIND, hands: '2AAAA', keyIdentifier: [14, 2] },
            { type: RANK.FOUROFAKIND, hands: '22223', keyIdentifier: [2, 3] },
            { type: RANK.FULLHOUSE, hands: '55566', keyIdentifier: [5, 6] },
            { type: RANK.FULLHOUSE, hands: 'KKAAA', keyIdentifier: [14, 13] },
            { type: RANK.STRAIGHT, hands: '2345A', keyIdentifier: [5] },
            { type: RANK.STRAIGHT, hands: 'TJQKA', keyIdentifier: [14] },
            { type: RANK.STRAIGHT, hands: '56789', keyIdentifier: [9] },
            { type: RANK.THREEOFAKIND, hands: '9TTTJ', keyIdentifier: [10, 11, 9] },
            { type: RANK.THREEOFAKIND, hands: '23444', keyIdentifier: [4, 3, 2] },
            { type: RANK.THREEOFAKIND, hands: '55567', keyIdentifier: [5, 7, 6] },
            { type: RANK.TWOPAIR, hands: '24477', keyIdentifier: [7, 4, 2] },
            { type: RANK.TWOPAIR, hands: '22334', keyIdentifier: [3, 2, 4] },
            { type: RANK.TWOPAIR, hands: '556TT', keyIdentifier: [10, 5, 6] },
            { type: RANK.PAIR, hands: '569AA', keyIdentifier: [14, 9, 6, 5] },
            { type: RANK.PAIR, hands: '5567A', keyIdentifier: [5, 14, 7, 6] },
            { type: RANK.PAIR, hands: '45TTQ', keyIdentifier: [10, 12, 5, 4] },
            { type: RANK.PAIR, hands: '455JQ', keyIdentifier: [5, 12, 11, 4] },
            { type: RANK.HIGHCARD, hands: '679JK', keyIdentifier: [13, 11, 9, 7, 6] }
        ];
        testCasesWithJoker = [
            { type: RANK.FIVEOFAKIND, hands: 'AAAA*', keyIdentifier: [14] },
            { type: RANK.FOUROFAKIND, hands: '3444*', keyIdentifier: [4, 3] },
            { type: RANK.FULLHOUSE, hands: 'TTJJ*', keyIdentifier: [11, 10] },
            { type: RANK.STRAIGHT, hands: '234A*', keyIdentifier: [5] },
            { type: RANK.STRAIGHT, hands: '345A*', keyIdentifier: [5] },
            { type: RANK.STRAIGHT, hands: '245A*', keyIdentifier: [5] },
            { type: RANK.STRAIGHT, hands: 'TJQK*', keyIdentifier: [14] },
            { type: RANK.STRAIGHT, hands: 'TQKA*', keyIdentifier: [14] },
            { type: RANK.STRAIGHT, hands: '5689*', keyIdentifier: [9] },
            { type: RANK.THREEOFAKIND, hands: '6788*', keyIdentifier: [8, 7, 6] },
            { type: RANK.PAIR, hands: '569T*', keyIdentifier: [10, 9, 6, 5] },
        ];
    });
    test('should correctly evaluate hands', () => {
        testCasesWithoutJoker.forEach(this.handyExpect);
    });
    test('should correctly evaluate hands with joker', () => {
        testCasesWithJoker.forEach(this.handyExpect);
    });
});