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
        let result = iterator.next().value(hand);
        while (result.rank === RANK.UNDETERMINED) {
            result = iterator.next().value(hand);
        }
        return result;
    }

    computeFourofAKind(hand: string): EvaluatedHand {
        const s = new Set(hand);
        const handArray = [...hand];
        if (s.size === 2) {
            const iterator = s.values();
            let v = iterator.next();
            while (true) {
                const size = handArray.filter(str => str === v.value).length;
                if (size === 4) {
                    s.delete(v.value);
                    return {
                        keyIndetifier: [CARD_RANKS[v.value], CARD_RANKS[s.values().next().value]],
                        rank: RANK.FOUROFAKIND
                    };
                }
                if (v.done) {
                    return {
                        keyIndetifier: null,
                        rank: RANK.UNDETERMINED
                    };
                }
                v = iterator.next();
            }
        }
        return {
            keyIndetifier: null,
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
