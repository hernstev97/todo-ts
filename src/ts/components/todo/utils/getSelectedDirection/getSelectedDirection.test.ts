import {getSelectedDirection} from "./getSelectedDirection";
const button = document.createElement('button');
button.setAttribute('data-movetodoindirection', 'up');

test('gets the direction-value from the data-attribute of a button', () => {
    expect(getSelectedDirection(button, 'up')).toBe(true)
})