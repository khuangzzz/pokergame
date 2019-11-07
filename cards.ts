import { EvaluatedHand, RANK, CARD_RANKS } from "./constants";

export class PokerParser {
    doEvaluation(hand: string): EvaluatedHand {
        const computationFunctions = [
            this.computeFourofAKind,
            this.computeFullHouse,
            this.computeStright,
            this.computeThreeOfAKind,
            this.computeTwoPairs,
            this.computePair,
            this.computeHighCard
        ];
        const iterator = computationFunctions[Symbol.iterator]();
        let result;
        if (hand.includes('*')) {
            result = this.computeRankWithJoker(hand);
        } else {
            result = iterator.next().value(hand);
        }
        while (result.rank === RANK.UNDETERMINED) {
            if (hand.includes('*')) {
                result = this.computeRankWithJoker(hand);
            } else {
                result = iterator.next().value(hand);
            }
        }
        return result;
    }

    computeRankWithJoker(hand: string): EvaluatedHand {
        // Looking for potential five of a kind
        let result = this.computeFourofAKind(hand);
        if (result.rank === RANK.FOUROFAKIND) {
            return {
                keyIndetifier: [result.keyIndetifier[0]],
                rank: RANK.FIVEOFAKIND
            };
        }
        // Looking for potential four of a kind
        result = this.computeThreeOfAKind(hand);
        if (result.rank === RANK.THREEOFAKIND) {
            return {
                keyIndetifier: [result.keyIndetifier[0], result.keyIndetifier[2]],
                rank: RANK.FOUROFAKIND
            };
        }

        // Looking for potential full house
        result = this.computeTwoPairs(hand);
        if (result.rank === RANK.TWOPAIR) {
            return {
                keyIndetifier: [result.keyIndetifier[0], result.keyIndetifier[1]],
                rank: RANK.FULLHOUSE
            };
        }

        // Looing for potential stright
        const delta = CARD_RANKS[hand[3]] - CARD_RANKS[hand[0]];
        if (hand.includes('A')) {
            if (delta === 4 || delta === 3) {
                return {
                    keyIndetifier: [CARD_RANKS['A']],
                    rank: RANK.STRAIGHT
                };
            }
            const possibility1 = hand[0] === '3' && hand[1] === '4' && hand[2] === '5';
            const possibility2 = hand[0] === '2' && hand[1] === '3' && hand[2] === '4';
            const possibility3 = hand[0] === '2' && hand[1] === '4' && hand[2] === '5';
            if (possibility1 || possibility2 || possibility3) {
                return {
                    keyIndetifier: [CARD_RANKS['5']],
                    rank: RANK.STRAIGHT
                };
            }
        } else {
            if (delta === 3) {
                return {
                    keyIndetifier: [CARD_RANKS[hand[3]] + 1],
                    rank: RANK.STRAIGHT
                };
            }
            if (delta === 4) {
                return {
                    keyIndetifier: [CARD_RANKS[hand[3]]],
                    rank: RANK.STRAIGHT
                }
            }
        }

        // Looking for potential three of a kind
        result = this.computePair(hand);
        if (result.rank === RANK.PAIR) {
            return {
                keyIndetifier: [result.keyIndetifier[0], result.keyIndetifier[2], result.keyIndetifier[3]],
                rank: RANK.THREEOFAKIND
            }
        }

        // Looking for potential pair
        result = this.computeHighCard(hand);
        return {
            keyIndetifier: result.keyIndetifier.slice(1),
            rank: RANK.PAIR
        };
    }

    computeFourofAKind(hand: string): EvaluatedHand {
        const [head1, ...rest1] = hand;
        let potentialFourofKind = new Set(rest1).size === 1;
        if (potentialFourofKind) {
            return {
                keyIndetifier: [CARD_RANKS[rest1[0]], CARD_RANKS[head1]],
                rank: RANK.FOUROFAKIND
            };
        }
        const [head2, ...rest2] = [...hand].reverse().join('');
        potentialFourofKind = new Set(rest2).size === 1;
        if (potentialFourofKind) {
            return {
                keyIndetifier: [CARD_RANKS[rest2[0]], CARD_RANKS[head2]],
                rank: RANK.FOUROFAKIND
            };
        }
        return {
            keyIndetifier: [],
            rank: RANK.UNDETERMINED
        };
    }

    computeFullHouse(hand: string): EvaluatedHand {
        const AAABB = hand[0] === hand[1] && hand[1] === hand[2] && hand[3] === hand[4];
        const AABBB = hand[0] === hand[1] && hand[2] === hand[3] && hand[3] === hand[4];
        if (AAABB) {
            return {
                keyIndetifier: [CARD_RANKS[hand[0]], CARD_RANKS[hand[4]]],
                rank: RANK.FULLHOUSE
            };
        }
        if (AABBB) {
            return {
                keyIndetifier: [CARD_RANKS[hand[4]], CARD_RANKS[hand[0]]],
                rank: RANK.FULLHOUSE
            };
        }
        return {
            keyIndetifier: [],
            rank: RANK.UNDETERMINED
        };
    }

    computeStright(hand: string): EvaluatedHand {
        if (hand.includes('A')) {
            const theSmallestStright = hand[0] === '2' && hand[1] === '3' && hand[2] === '4' && hand[3] === '5';
            if (theSmallestStright) {
                return {
                    keyIndetifier: [CARD_RANKS[hand[3]]],
                    rank: RANK.STRAIGHT
                };
            }
            const theBiggestStright = hand[0] === 'T' && hand[1] === 'J' && hand[2] === 'Q' && hand[3] === 'K';
            if (theBiggestStright) {
                return {
                    keyIndetifier: [CARD_RANKS[hand[4]]],
                    rank: RANK.STRAIGHT
                };
            }
            return {
                keyIndetifier: null,
                rank: RANK.UNDETERMINED
            };
        }
        let next = hand[1];
        let i = 0;
        do {
            if (CARD_RANKS[hand[i]] + 1 !== CARD_RANKS[next]) {
                return {
                    keyIndetifier: null,
                    rank: RANK.UNDETERMINED
                };
            }
            i = i + 1;
            next = hand[i + 1];
        } while (i < hand.length - 1);
        return {
            keyIndetifier: [CARD_RANKS[hand[4]]],
            rank: RANK.STRAIGHT
        };
    }

    computeThreeOfAKind(hand: string): EvaluatedHand {
        const regex = new RegExp(/(.)\1{2,}/);
        if (regex.test(hand)) {
            const kind = regex.exec(hand)[0][0];
            return {
                keyIndetifier: [CARD_RANKS[kind], ...[...hand].filter(str => str !== kind).map(rest => CARD_RANKS[rest]).reverse()],
                rank: RANK.THREEOFAKIND
            };
        }
        return {
            keyIndetifier: null,
            rank: RANK.UNDETERMINED
        };
    }
    // AABBC ABBCC AABCC
    computeTwoPairs(hand: string): EvaluatedHand {
        const AABBC = hand[0] === hand[1] && hand[2] === hand[3];
        const ABBCC = hand[1] === hand[2] && hand[3] === hand[4];
        const AABCC = hand[0] === hand[1] && hand[3] === hand[4];
        if (AABBC) {
            return {
                keyIndetifier: [CARD_RANKS[hand[2]], CARD_RANKS[hand[1]], CARD_RANKS[hand[4]]],
                rank: RANK.TWOPAIR
            };
        }
        if (ABBCC) {
            return {
                keyIndetifier: [CARD_RANKS[hand[3]], CARD_RANKS[hand[1]], CARD_RANKS[hand[0]]],
                rank: RANK.TWOPAIR
            };
        }
        if (AABCC) {
            return {
                keyIndetifier: [CARD_RANKS[hand[3]], CARD_RANKS[hand[1]], CARD_RANKS[hand[2]]],
                rank: RANK.TWOPAIR
            };
        }
        return {
            keyIndetifier: null,
            rank: RANK.UNDETERMINED
        };
    }

    computePair(hand: string): EvaluatedHand {
        const regex = new RegExp(/(.)\1{1,}/);
        if (regex.test(hand)) {
            const kind = regex.exec(hand)[0][0];
            return {
                keyIndetifier: [CARD_RANKS[kind], ...[...hand].filter(str => str !== kind).map(rest => CARD_RANKS[rest]).reverse()],
                rank: RANK.PAIR
            };
        }
        return {
            keyIndetifier: null,
            rank: RANK.UNDETERMINED
        };
    }

    computeHighCard(hand: string): EvaluatedHand {
        return {
            keyIndetifier: [...hand].map(str => CARD_RANKS[str]).reverse(),
            rank: RANK.HIGHCARD
        };
    }

}
