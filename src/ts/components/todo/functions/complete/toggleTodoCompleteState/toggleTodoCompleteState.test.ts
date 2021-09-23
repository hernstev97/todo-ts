import { toggleTodoCompleteState } from "./toggleTodoCompleteState";
import TodoItem from "../../../interfaces/TodoItem";
import getUniqueId from "../../../../../util/uniqueId/uniqueId";

const todo: TodoItem = {
    id: getUniqueId(),
    title: 'This is a title',
    completed: false,
}

const parent = document.createElement('div');

describe('sets the completed attribute of a todoItem to the opposite and removes or adds a class', () => {
    test('set completed to true and add class', () => {
        toggleTodoCompleteState(todo, parent);
        expect(todo.completed).toBe(true)
        expect(parent.classList.value).toEqual('todo--completed')
    });

    test('set completed to false and remove class', () => {
        todo.completed = true;
        toggleTodoCompleteState(todo, parent);
        expect(todo.completed).toBe(false)
        expect(parent.classList.value).toEqual('')
    });
});