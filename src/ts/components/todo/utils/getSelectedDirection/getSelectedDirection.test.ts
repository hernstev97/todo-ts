import { getSelectedDirection } from "./getSelectedDirection";

const buttonUp = document.createElement('button');
buttonUp.setAttribute('data-movetodoindirection', 'up');

const buttonDown = document.createElement('button');
buttonDown.setAttribute('data-movetodoindirection', 'down');

describe('gets the direction-value from the data-attribute of a button', () => {
    test('should be up', () => {
        expect(getSelectedDirection(buttonUp, 'up')).toBe(true)
    })

    test('should not be down', () => {
        expect(getSelectedDirection(buttonUp, 'down')).toBe(false)
    })

    test('should be down', () => {
        expect(getSelectedDirection(buttonDown, 'down')).toBe(true)
    })

    test('should not be up', () => {
        expect(getSelectedDirection(buttonDown, 'up')).toBe(false)
    })
})