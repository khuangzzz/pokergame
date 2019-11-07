import { validateInput } from '../../main';
describe('input validator', () => {
    test('should catch the cheater', () => {
        const testCases = [
            'aaaaj a9876',
            'kkkqq qkkqq'
        ];
        expect(validateInput(testCases[0])).toEqual('Hey, you are cheating');
        expect(validateInput(testCases[1])).toEqual('Hey, you are cheating');
    });

    test('should make sure cards input is valid', () => {
        const testCases = [
            'kkkqq xzcvv',
            '()@!*$ qkkqq',
            '',
            '    ',
            'lksadguv23'
        ];
        expect(validateInput(testCases[0])).toEqual('this hand: XZCVV is not valid');
        expect(validateInput(testCases[1])).toEqual('Each hand must be exactly five cards sparated by space');
        expect(validateInput(testCases[2])).toEqual('Each hand must be exactly five cards sparated by space');
        expect(validateInput(testCases[3])).toEqual('Each hand must be exactly five cards sparated by space');
        expect(validateInput(testCases[4])).toEqual('Each hand must be exactly five cards sparated by space');
    });
});