import { EvaluatedHand, RANK } from '../../constants';
import { Hands } from '../../hand';
import { PokerParser } from '../../cards';
describe('Hands', () => {
    test('should correctly compare hands with different rank', () => {
        const parser = new PokerParser();
        const evaluatedHands = {
            [RANK.FOUROFAKIND]: parser.computeFourofAKind('22223'),
            [RANK.FULLHOUSE]: parser.computeFullHouse('55566'),
            [RANK.STRAIGHT]: parser.computeStright('45678'),
            [RANK.THREEOFAKIND]: parser.computeThreeOfAKind('23444'),
            [RANK.TWOPAIR]: parser.computeTwoPairs('556TT'),
            [RANK.PAIR]: parser.computePair('45TTQ'),
            [RANK.HIGHCARD]: parser.computeHighCard('79TQK')
        };
        const expectedResults = [
            ['NA', 'a', 'a', 'a', 'a', 'a', 'a'],
            ['b', 'NA', 'a', 'a', 'a', 'a', 'a'],
            ['b', 'b', 'NA', 'a', 'a', 'a', 'a'],
            ['b', 'b', 'b', 'NA', 'a', 'a', 'a'],
            ['b', 'b', 'b', 'b', 'NA', 'a', 'a'],
            ['b', 'b', 'b', 'b', 'b', 'NA', 'a'],
            ['b', 'b', 'b', 'b', 'b', 'b', 'NA'],
        ];
        Object.keys(evaluatedHands).reverse().forEach((r, index) => {
            const currentEvaluatedHand = evaluatedHands[r];
            Object.values(evaluatedHands).reverse().forEach((hand, idx) => {
                if (idx !== index) {
                    const hands = new Hands([currentEvaluatedHand, hand]);
                    expect(hands.compare()).toEqual(expectedResults[index][idx]);
                }
            });
        });
    });
    test('should correctly compare hands with same rank', () => {
        const parser = new PokerParser();
        const evaluatedHands = [
            [parser.computeFourofAKind('22223'), parser.computeFourofAKind('4AAAA')],
            [parser.computeFullHouse('55566'), parser.computeFullHouse('KK888')],
            [parser.computeStright('45678'), parser.computeStright('TJQKA')],
            [parser.computeThreeOfAKind('23444'), parser.computeThreeOfAKind('6TTTA')],
            [parser.computeTwoPairs('556TT'), parser.computeTwoPairs('5QQKK')],
            [parser.computePair('45TTQ'), parser.computePair('89TAA')],
            [parser.computeHighCard('79TQK'), parser.computeHighCard('89TQK')]
        ];

        evaluatedHands.forEach(testCase => {
            let hands = new Hands(testCase);
            expect(hands.deepCompare()).toEqual('b');
            hands = new Hands(testCase.reverse());
            expect(hands.deepCompare()).toEqual('a');
        });
    });

    test('should correctly compare hands with same rank and same key indentifier', () => {
        const parser = new PokerParser();
        const evaluatedHands = [
            [parser.computeFourofAKind('22223'), parser.computeFourofAKind('22223')],
            [parser.computeFullHouse('55566'), parser.computeFullHouse('55566')],
            [parser.computeStright('45678'), parser.computeStright('45678')],
            [parser.computeThreeOfAKind('23444'), parser.computeThreeOfAKind('23444')],
            [parser.computeTwoPairs('556TT'), parser.computeTwoPairs('556TT')],
            [parser.computePair('45TTQ'), parser.computePair('45TTQ')],
            [parser.computeHighCard('79TQK'), parser.computeHighCard('79TQK')]
        ];

        evaluatedHands.forEach(testCase => {
            let hands = new Hands(testCase);
            expect(hands.deepCompare()).toEqual('ab');
            hands = new Hands(testCase.reverse());
            expect(hands.deepCompare()).toEqual('ab');
        });
    });
});