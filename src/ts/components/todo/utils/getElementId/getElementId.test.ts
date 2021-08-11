import { getElementId } from "./getElementId";

test('generates an Id containing uppercase and lowercase letters and numbers', () => {
    document.body.innerHTML = `<div data-id="uid#92U7gf3GaHd"></div>`
    const element = document.querySelector('[data-id]') as Element;
    expect(getElementId(element)).toMatch(/uid#[a-zA-Z0-9]*/i)
});