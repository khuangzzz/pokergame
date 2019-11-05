import { CARD_RANKS } from './cards';

enum RANKING {
    HIGHCARD = 1,
    PAIR,
    TWOPAIR,
    THREEOFAKIND,
    STRAIGHT,
    FULLHOUSE,
    FOUROFAKIND,
    UNDETERMINED
}

interface Result {
    keyIndetifier: number[];
    rank: RANKING;
}

export class PokerEvaluator {
    result: Result[][];
    constructor(handsSet: { [key: string]: string }) {
        const handpairs = Object.values(handsSet).map(
            handSet => handSet.split(' ').map(hand => [...hand].sort((a, b) => CARD_RANKS[a] >= CARD_RANKS[b] ? 1 : 0).join('').toUpperCase())
        );
        this.result = handpairs.map(handpair => handpair.map(hand => this.doEvaluation(hand)));
        console.log(this.result);
    }

    doEvaluation(hand: string): Result {
        const computationFunctions = [
            this.computeFourofAKind,
            this.computeFullHouse,
            this.computeStright,
            this.computeThreeOfAKind,
            this.computeTwoPairs,
            this.computePair,
            this.computePair
        ]
        const iterator = computationFunctions[Symbol.iterator]();
        let result = iterator.next().value(hand);
        while (result.rank === RANKING.UNDETERMINED) {
            result = iterator.next().value(hand);
        }
        return result;
    }

    computeFourofAKind(hand: string): Result {
        const s = new Set(hand);
        const handArray = [...hand];
        if (s.size === 2) {
            const iterator = s.values();
            let v = iterator.next();
            while (true) {
                const size = handArray.filter(str => str === v.value).length;
                if (size === 4) {
                    return {
                        keyIndetifier: [CARD_RANKS[v.value], iterator.next()],
                        rank: RANKING.FOUROFAKIND
                    };
                }
                if (v.done) {
                    return {
                        keyIndetifier: null,
                        rank: RANKING.UNDETERMINED
                    };
                }
                v = iterator.next();
            }
        }
        return {
            keyIndetifier: null,
            rank: RANKING.UNDETERMINED
        };
    }

    computeFullHouse(hand: string): Result {
        const AAABB = hand[0] === hand[1] && hand[1] === hand[2] && hand[3] === hand[4];
        const AABBB = hand[0] === hand[1] && hand[2] === hand[3] && hand[3] === hand[4];
        if (AAABB) {
            return {
                keyIndetifier: [CARD_RANKS[hand[0]], CARD_RANKS[hand[4]]],
                rank: RANKING.FULLHOUSE
            };
        }
        if (AABBB) {
            return {
                keyIndetifier: [CARD_RANKS[hand[4]], CARD_RANKS[hand[0]]],
                rank: RANKING.FULLHOUSE
            };
        }
        return {
            keyIndetifier: [],
            rank: RANKING.UNDETERMINED
        };
    }

    computeStright(hand: string): Result {
        if (hand.includes('A')) {
            const theSmallestStright = hand[0] === '2' && hand[1] === '3' && hand[2] === '4' && hand[3] === '5';
            if (theSmallestStright) {
                return {
                    keyIndetifier: [CARD_RANKS[hand[4]], CARD_RANKS[hand[0]]],
                    rank: RANKING.STRAIGHT
                };
            }
            const theBiggestStright = hand[0] === 'T' && hand[1] === 'J' && hand[2] === 'Q' && hand[3] === 'K';
            if (theBiggestStright) {
                return {
                    keyIndetifier: [CARD_RANKS[hand[4]], CARD_RANKS[hand[0]]],
                    rank: RANKING.STRAIGHT
                };
            }
            return {
                keyIndetifier: null,
                rank: RANKING.UNDETERMINED
            };
        }
        let next = hand[1];
        let i = 0;
        do {
            if (CARD_RANKS[hand[i]] + 1 !== CARD_RANKS[next]) {
                return {
                    keyIndetifier: null,
                    rank: RANKING.UNDETERMINED
                };
            }
            i = i + 1;
            next = hand[i + 1];
        } while (i < hand.length - 1);
        return {
            keyIndetifier: [CARD_RANKS[hand[4]]],
            rank: RANKING.STRAIGHT
        };
    }

    computeThreeOfAKind(hand: string): Result {
        const regex = new RegExp(/(.)\1{2,}/);
        if (regex.test(hand)) {
            const kind = regex.exec(hand)[0][0];
            return {
                keyIndetifier: [CARD_RANKS[kind], ...[...hand].filter(str => str !== kind).map(rest => CARD_RANKS[rest])],
                rank: RANKING.THREEOFAKIND
            };
        }
        return {
            keyIndetifier: null,
            rank: RANKING.UNDETERMINED
        };
    }
    // AABBC ABBCC AABCC
    computeTwoPairs(hand: string): Result {
        const AABBC = hand[0] === hand[1] && hand[2] === hand[3];
        const ABBCC = hand[1] === hand[2] && hand[3] === hand[4];
        const AABCC = hand[0] === hand[1] && hand[3] === hand[4];
        if (AABBC) {
            return {
                keyIndetifier: [CARD_RANKS[hand[2]], CARD_RANKS[hand[1]], CARD_RANKS[hand[4]]],
                rank: RANKING.TWOPAIR
            };
        }
        if (ABBCC) {
            return {
                keyIndetifier: [CARD_RANKS[hand[3]], CARD_RANKS[hand[1]], CARD_RANKS[hand[0]]],
                rank: RANKING.TWOPAIR
            };
        }
        if (AABCC) {
            return {
                keyIndetifier: [CARD_RANKS[hand[3]], CARD_RANKS[hand[1]], CARD_RANKS[hand[2]]],
                rank: RANKING.TWOPAIR
            };
        }
        return {
            keyIndetifier: null,
            rank: RANKING.UNDETERMINED
        };
    }

    computePair(hand: string): Result {
        const regex = new RegExp(/(.)\1{1,}/);
        if (regex.test(hand)) {
            const kind = regex.exec(hand)[0][0];
            return {
                keyIndetifier: [CARD_RANKS[kind], ...[...hand].filter(str => str !== kind).map(rest => CARD_RANKS[rest])],
                rank: RANKING.PAIR
            };
        }
        return {
            keyIndetifier: null,
            rank: RANKING.UNDETERMINED
        };
    }

    computeHighCard(hand: string): Result {
        return {
            keyIndetifier: [...hand].map(str => CARD_RANKS[str]),
            rank: RANKING.HIGHCARD
        };
    }
}
