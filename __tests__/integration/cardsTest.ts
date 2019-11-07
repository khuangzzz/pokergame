import { PokerParser } from "../../cards";
import { RANK } from "../../constants";

describe('PokerParser', () => {
    const pokerParser = new PokerParser();
    let testCasesWithoutJoker: { type: RANK, hands: string, keyIndetifier?: number[] }[];
    let testCasesWithJoker: { type: RANK, hands: string, keyIndetifier?: number[] }[];

    this.handyExpect = (testCase) => {
        const result = pokerParser.doEvaluation(testCase.hands);
        expect(result.rank).toEqual(testCase.type);
        expect(result.keyIndetifier).toEqual(testCase.keyIndetifier);
    }

    beforeAll(() => {
        testCasesWithoutJoker = [
            { type: RANK.FOUROFAKIND, hands: '2AAAA', keyIndetifier: [14, 2] },
            { type: RANK.FOUROFAKIND, hands: '22223', keyIndetifier: [2, 3] },
            { type: RANK.FULLHOUSE, hands: '55566', keyIndetifier: [5, 6] },
            { type: RANK.FULLHOUSE, hands: 'KKAAA', keyIndetifier: [14, 13] },
            { type: RANK.STRAIGHT, hands: '2345A', keyIndetifier: [5] },
            { type: RANK.STRAIGHT, hands: 'TJQKA', keyIndetifier: [14] },
            { type: RANK.STRAIGHT, hands: '56789', keyIndetifier: [9] },
            { type: RANK.THREEOFAKIND, hands: '9TTTJ', keyIndetifier: [10, 11, 9] },
            { type: RANK.THREEOFAKIND, hands: '23444', keyIndetifier: [4, 3, 2] },
            { type: RANK.THREEOFAKIND, hands: '55567', keyIndetifier: [5, 7, 6] },
            { type: RANK.TWOPAIR, hands: '24477', keyIndetifier: [7, 4, 2] },
            { type: RANK.TWOPAIR, hands: '22334', keyIndetifier: [3, 2, 4] },
            { type: RANK.TWOPAIR, hands: '556TT', keyIndetifier: [10, 5, 6] },
            { type: RANK.PAIR, hands: '569AA', keyIndetifier: [14, 9, 6, 5] },
            { type: RANK.PAIR, hands: '5567A', keyIndetifier: [5, 14, 7, 6] },
            { type: RANK.PAIR, hands: '45TTQ', keyIndetifier: [10, 12, 5, 4] },
            { type: RANK.PAIR, hands: '455JQ', keyIndetifier: [5, 12, 11, 4] },
            { type: RANK.HIGHCARD, hands: '679JK', keyIndetifier: [13, 11, 9, 7, 6] }
        ];
        testCasesWithJoker = [
            { type: RANK.FIVEOFAKIND, hands: 'AAAA*', keyIndetifier: [14] },
            { type: RANK.FOUROFAKIND, hands: '3444*', keyIndetifier: [4, 3] },
            { type: RANK.FULLHOUSE, hands: 'TTJJ*', keyIndetifier: [11, 10] },
            { type: RANK.STRAIGHT, hands: '234A*', keyIndetifier: [5] },
            { type: RANK.STRAIGHT, hands: '345A*', keyIndetifier: [5] },
            { type: RANK.STRAIGHT, hands: '245A*', keyIndetifier: [5] },
            { type: RANK.STRAIGHT, hands: 'TJQK*', keyIndetifier: [14] },
            { type: RANK.STRAIGHT, hands: 'TQKA*', keyIndetifier: [14] },
            { type: RANK.STRAIGHT, hands: '5689*', keyIndetifier: [9] },
            { type: RANK.THREEOFAKIND, hands: '6788*', keyIndetifier: [8, 7, 6] },
            { type: RANK.PAIR, hands: '569T*', keyIndetifier: [10, 9, 6, 5] },
        ];
    });
    test('should correctly evaluate hands', () => {
        testCasesWithoutJoker.forEach(this.handyExpect);
    });
    test('should correctly evaluate hands with joker', () => {
        testCasesWithJoker.forEach(this.handyExpect);
    });
});