import prompts from 'prompts';
import { PokerEvaluator } from './pokerEvaluator';
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
            const options = <unknown>new Array(answer).fill('').map((_, idx) => ({
                type: 'text',
                name: `pokerHands${idx}`,
                message: `Please input two hands seperated by space, ${idx}:`,
                validate: value => {
                    const v = value.toUpperCase();
                    if (v.length !== 11) {
                        return false;
                    }
                    const regex = new RegExp(/[TJQKA0-9]{5}\s[TJQKA0-9]{5}/);
                    return regex.test(v);
                }
            })) as prompts.PromptObject;
            response = await prompts(options);
            const evaluator = new PokerEvaluator(response);
        }
    });

})();
