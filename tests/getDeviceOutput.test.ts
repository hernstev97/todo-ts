const getDeviceOutputTest = require('../src/ts/util/getDeviceOutput')

describe('returns a string with the name of the current device type based on resolution', () => {
    test('mobile', () => {
        expect(getDeviceOutputTest(633)).toBe('mobile')
    });

    test('tablet', () => {
        expect(getDeviceOutputTest(1239)).toBe('tablet')
    });

    test('desktop', () => {
        expect(getDeviceOutputTest(1450)).toBe('desktop')
    });
});