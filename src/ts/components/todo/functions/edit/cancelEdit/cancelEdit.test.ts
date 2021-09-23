import { cancelEdit } from "./cancelEdit";

const paragraph = document.createElement('p');
paragraph.textContent = 'This is just for testing.';

const titleWrapper = document.createElement('div');
titleWrapper.appendChild(paragraph);

const input = document.createElement('input');
input.value = 'This is something different.';

test('sets the input value to the text content of the p tag', () => {
    cancelEdit(input, titleWrapper)
    expect(input.value).toEqual(paragraph.textContent);
});