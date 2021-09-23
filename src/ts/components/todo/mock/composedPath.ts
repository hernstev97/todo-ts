const todoOne = document.createElement('div');
todoOne.classList.add('todo');

const todoTwo = document.createElement('div');
todoTwo.classList.add('todo-two');

const todoThree = document.createElement('div');
todoThree.classList.add('todo-three');

export const composedPath = (): EventTarget[] => {
    return [
        todoThree,
        todoTwo,
        todoOne
    ]
}