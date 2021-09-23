import { getElementId } from "./getElementId";

test('gets the value of the data-id attribute of an html element', () => {
    document.body.innerHTML = `<div data-id="uid#92U7gf3GaHd"></div>`
    const element = document.querySelector('[data-id]') as Element;
    expect(getElementId(element)).toMatch(/uid#[a-zA-Z0-9]*/i)
});