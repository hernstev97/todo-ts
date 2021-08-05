import getUniqueId from "../src/ts/util/uniqueId";

test('generates an Id containing uppercase and lowercase letters and numbers', () => {
    expect(getUniqueId()).toMatch(/[a-zA-Z0-9]*/i)
});