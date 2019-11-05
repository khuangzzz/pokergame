"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = __importDefault(require("prompts"));
const pokerEvaluator_1 = require("./pokerEvaluator");
(() => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    yield prompts_1.default([
        {
            type: 'number',
            name: 'value',
            message: 'How many hands would you like to evaluate?',
            validate: value => Number.isInteger(value)
        }
    ], {
        onSubmit: (prompt, answer) => __awaiter(void 0, void 0, void 0, function* () {
            const options = new Array(answer).fill('').map((_, idx) => ({
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
            }));
            response = yield prompts_1.default(options);
            const evaluator = new pokerEvaluator_1.PokerEvaluator(response);
        })
    });
}))();
