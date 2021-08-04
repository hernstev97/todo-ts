const validateInputTest = require('../src/ts/util/validateInput')

describe('takes a string and validates it through several criteria', () => {
    test('string has no length', () => {
        expect(validateInputTest('')).toBe(false);
    });

    test('string only contains spaces', () => {
        expect(validateInputTest('   ')).toBe(false);
    });

    test('string is valid', () => {
        expect(validateInputTest('This is a test. 123&*^')).toBe(true);
    });
});