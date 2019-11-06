import { validateInput } from '../../main';
describe('input validator', () => {
    test('should catch the cheater', () => {
        const testCases = [
            'aaaaj a9876',
            'kkkqq qkkqq'
        ];
        testCases.forEach(testCase => expect(validateInput(testCase)).toBe(false));
    });

    test('should make sure cards input is valid', () => {
        const testCases = [
            'kkkqq xzcvv',
            '()@!*$ qkkqq',
            '',
            '    ',
            'lksadguv23'
        ];
        testCases.forEach(testCase => expect(validateInput(testCase)).toBe(false));
    });
});