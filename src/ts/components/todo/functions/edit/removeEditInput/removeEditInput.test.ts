import { removeEditInput } from "./removeEditInput";

const input = document.createElement('input');

// @TODO find out how to test the addition/removal of eventlisteners
describe('removes the class todo__title--edit from the title of the todo', () => {
    test('multiple classes', () => {
        const titleWrapper = document.createElement('div');
        titleWrapper.classList.add('todo');
        titleWrapper.classList.add('todo__title--edit');
        removeEditInput(input, titleWrapper)
        expect(titleWrapper.classList.value).toEqual('todo');
    });

    test('one class', () => {
        const titleWrapper = document.createElement('div');
        titleWrapper.classList.add('todo__title--edit');
        removeEditInput(input, titleWrapper)
        expect(titleWrapper.classList.value).toEqual('');
    });

    test('empty classlist', () => {
        const titleWrapper = document.createElement('div');
        removeEditInput(input, titleWrapper)
        expect(titleWrapper.classList.value).toEqual('');
    });
})