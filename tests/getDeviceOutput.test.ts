import getDeviceOutput from "../src/ts/util/getDeviceOutput";

describe('returns a string with the name of the current device type based on resolution', () => {
    test('mobile', () => {
        expect(getDeviceOutput(633)).toBe('mobile')
    });

    test('tablet', () => {
        expect(getDeviceOutput(1239)).toBe('tablet')
    });

    test('desktop', () => {
        expect(getDeviceOutput(1450)).toBe('desktop')
    });
});