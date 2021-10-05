import { composedPath } from "../../mock/composedPath";
import { getTodoFromEventPath } from "./getTodoFromEventPath";

const targetTodo = document.createElement('div');
targetTodo.classList.add('todo');

test('pulls the entire todo-element from a composedPath() Array based on its classname "todo"', () => {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo');
    expect(getTodoFromEventPath(composedPath(targetTodo))).toEqual(todoElement);
})