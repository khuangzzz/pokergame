import prompts from 'prompts';
import { PokerEvaluator } from './pokerEvaluator';

const buildOptions = (answer) => <unknown>new Array(answer).fill('').map((_, idx) => ({
    type: 'text',
    name: `pokerHands${idx}`,
    message: `Please input two hands seperated by space, ${idx}:`,
    validate: value => {
        const v = value.toUpperCase();
        if (v.length !== 11) {
            return false;
        }
        const regex = new RegExp(/[TJQKA0-9]{5}\s[TJQKA0-9]{5}/);
        const counts = [...value.toUpperCase()].reduce((accumulated, current) => {
            if (accumulated[current]) {
                return { ...accumulated, [current]: accumulated[current] + 1 };
            }
            return { ...accumulated, [current]: 1 };
        }, {});
        return regex.test(v) && !Object.values(counts).find(c => c > 4);
    }
}));

(async () => {
    let response;
    await prompts([
        {
            type: 'number',
            name: 'value',
            message: 'How many hands would you like to evaluate?',
            validate: value => Number.isInteger(value)
        }
    ], {
        onSubmit: async (prompt, answer) => {
            const options = buildOptions(answer) as prompts.PromptObject;
            response = await prompts(options);
            new PokerEvaluator(response);
        }
    });

})();
