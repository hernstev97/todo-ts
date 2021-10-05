const todoTwo = document.createElement('div');
todoTwo.classList.add('todo-two');

const todoThree = document.createElement('div');
todoThree.classList.add('todo-three');

export const composedPath = (targetTodo: HTMLDivElement): EventTarget[] => {
    return [
        todoThree,
        todoTwo,
        targetTodo
    ]
}