import validateInput from "./validateInput";

describe('takes a string and validates it through several criteria', () => {
    test('string has no length', () => {
        expect(validateInput('')).toBe(false);
    });

    test('string only contains spaces', () => {
        expect(validateInput('   ')).toBe(false);
    });

    test('string is valid', () => {
        expect(validateInput('This is a test. 123&*^')).toBe(true);
    });
});