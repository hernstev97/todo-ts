import getUniqueId from "./uniqueId";

test('generates an Id containing uppercase and lowercase letters and numbers', () => {
    expect(getUniqueId()).toMatch(/uid#[a-zA-Z0-9]*/i)
});