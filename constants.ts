export const CARD_RANKS = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
    '*': 15
};

export interface EvaluatedHand {
    keyIdentifier: number[];
    rank: RANK;
}

export enum RANK {
    HIGHCARD = 1,
    PAIR,
    TWOPAIR,
    THREEOFAKIND,
    STRAIGHT,
    FULLHOUSE,
    FOUROFAKIND,
    FIVEOFAKIND,
    UNDETERMINED
}
