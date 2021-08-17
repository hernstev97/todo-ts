const todoElement = document.createElement('div');
todoElement.classList.add('todo');
const todoTestElement = document.createElement('div');
todoTestElement.classList.add('todo-test');
const todoTesterElement = document.createElement('div');
todoTesterElement.classList.add('todo-tester');

export const composedPath = (): EventTarget[] => {
    return [
        todoTestElement,
        todoTesterElement,
        todoElement
    ]
}