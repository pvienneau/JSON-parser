import fs from 'fs';

import Parser from '../dist/parser.js';
// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('Parser', () => {
    let parser;

    beforeEach(() => {
        parser = new Parser();
    });

    describe('eat()', () => {
        it('should eat the provided regular expression', () => {
            const value = 'abc123';

            expect(parser.eat(value, 'abc')).toBe('123');
        });

        it('should return an empty string if the whole string has been eatedn', () => {
            const value = 'abc';

            expect(parser.eat(value, 'abc')).toBe('');
        });

        it('should eat the provided regular expression', () => {
            const value = '{}';

            expect(parser.eat(value, '{')).toBe('}');
        });

        it('should return false if regular expression is not matched', () => {
            const value = 'abc123';

            expect(parser.eat(value, '123')).toBeFalsy();
        });

        it('should return false if the input is not a string', () => {
            expect(parser.eat(false, '123')).toBeFalsy();
        });

        it('should return false if the input is an empty string', () => {
            expect(parser.eat('', '123')).toBeFalsy();
        });

        it('should correctly eat even if whitespaces are present at the start of the string', () => {
            expect(parser.eat(' abc123', 'abc')).toBe('123')
        });
    });

    describe('integer()', () => {
        it('should correctly handle negative numbers', () => {
            expect(parser.integer('-123ok')).toBe('ok');
        });

        it('should correctly handle decimals', () => {
            expect(parser.integer('1.123ok')).toBe('ok');
        });

        it('should correctly handle scientific notation numbers', () => {
            expect(parser.integer('1e12ok')).toBe('ok');
        });
    });

    describe('string()', () => {
        it('should correectly handle a double quoted string', () => {
            expect(parser.string('"This is a string"ok')).toBe('ok');
        });

        it('should allow for escaped double quotes', () => {
            expect(parser.string('"The quote says: \\"This is my life\\""ok')).toBe('ok');
        });

        /*it('should accept all allowable escaped characters, as per the ECMA-404 JSON standard, when in strict mode', () => {
            const value = '"abc\"\\\/\b\f\n\r\t\u12df"';
            parser = new Parser(null, true);

            expect(parser.string(value)).toBeTruthy();

            expect(parser.parse('"\\u12os"')).toBeFalsy();
            expect(parser.parse('"\\l"'));
            expect(parser.parse('"\\."'));
        });*/
    });

    describe('parse()', () => {
        it('should not pass for an empty value', () => {
            const value = '';
            const result = parser.parse(value);

            expect(result).toBeFalsy();
        });

        it('should pass for an empty object', () => {
            const value = '{}';
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });

        it('should pass for an empty array', () => {
            const value = '[]';
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });

        it('should pass for an array of one integer', () => {
            const value = '[1]';
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });

        it('should pass for an array of multiple integers', () => {
            const value = '[1,2]';
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });

        it('should pass for an array of multiple integers and strings and booleans', () => {
            const value = '[1,true,"one",2,"two",false]';
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });

        it('should allow for an JSON with whitespaces to pass', () => {
            const value = '[1, 2, 3, 4]';
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });

        it('should pass for an array of arrays', () => {
            const value = '[[], [[], []]]';
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });

        it('should pass for an object with one key/value pair', () => {
            const value = '{"apple":"yes"}';
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });

        it('should pass for an object with multiple key/value pairs', () => {
            const value = '{"apple":"yes", "pears": false}';
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });

        it('should pass for an object with nested objects as key/value pairs', () => {
            const value = '{"apple":{"answer": false}, "pears": {"answer": "yes"}}';
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });

        it('should pass a full JSON complex structure', () => {
            const value = fs.readFileSync(`${__dirname}/example.json`, 'utf8');
            const result = parser.parse(value);

            expect(result).toBeTruthy();
        });
    });
});
