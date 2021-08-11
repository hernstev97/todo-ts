import { getFontSizeREM } from "./setFontSizeForEachTodo";
const text50 = 'Lorem ipsum dolor sit amet, consetetur sadipscing ';
const text100 = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l';
const text150 = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam volu';
const p = document.createElement('p')

describe('returns a string containing a fontsize in rem based on text length and deviceoutput', () => {
    test('mobile 50 characters', () => {
        p.textContent = text50;
        expect(getFontSizeREM(p, 'mobile')).toBe('1rem')
    });

    test('mobile 100 characters', () => {
        p.textContent = text100;
        expect(getFontSizeREM(p, 'mobile')).toBe('0.85rem')
    });

    test('mobile 150 characters', () => {
        p.textContent = text150;
        expect(getFontSizeREM(p, 'mobile')).toBe('0.85rem')
    });

    test('tablet 50 characters', () => {
        p.textContent = text50;
        expect(getFontSizeREM(p, 'tablet')).toBe('1.3rem')
    });

    test('tablet 100 characters', () => {
        p.textContent = text100;
        expect(getFontSizeREM(p, 'tablet')).toBe('1rem')
    });

    test('tablet 150 characters', () => {
        p.textContent = text150;
        expect(getFontSizeREM(p, 'tablet')).toBe('0.8rem')
    });

    test('desktop 50 characters', () => {
        p.textContent = text50;
        expect(getFontSizeREM(p, 'desktop')).toBe('1.4rem')
    });

    test('desktop 100 characters', () => {
        p.textContent = text100;
        expect(getFontSizeREM(p, 'desktop')).toBe('1.4rem')
    });

    test('desktop 150 characters', () => {
        p.textContent = text150;
        expect(getFontSizeREM(p, 'desktop')).toBe('1rem')
    });
});