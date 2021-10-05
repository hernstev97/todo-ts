import { renderAllTodos } from "./renderAllTodos";
import TodoItem from "../../interfaces/TodoItem";

const todo: TodoItem = {
    id: 'uid#40iV8A5404',
    title: 'Einkaufen',
    description: 'Brot, Nudeln, Küchenrolle',
    completed: false,
}

const todos = [todo];

const resultHTML: string =
    `<div data-todo="todoItem" class="todo " data-id="uid#40iV8A5404">
        <div class="todo__flex-container">
            <div class="todo__title" data-todo="todoTitle">
                <p class="todo__label">Einkaufen</p>
                <p class="todo__label todo__description">Brot, Nudeln, Küchenrolle</p>
            </div>
            <div class="todo__interaction-wrapper">
                <div class="data-modification-wrapper">
                    <input class="todo__interaction todo__interaction--done" data-todo="todoCompletedCheckbox" type="checkbox" data-id="uid#40iV8A5404">
                    <button data-todo="editTodoButton" data-modal="edit" class="todo__interaction todo__interaction--edit" data-id="uid#40iV8A5404">Bearbeiten</button>
                    <button data-todo="deleteSingleTodoButton" class="todo__interaction--delete todo__interaction" data-id="uid#40iV8A5404">Entfernen</button>
                </div>
                <div class="move-wrapper">
                    <button class="todo__move todo__move--up" data-id="uid#40iV8A5404" data-movetodoindirection="up">
                    <span></span>
                    </button>
                    <button class="todo__move todo__move--down" data-id="uid#40iV8A5404" data-movetodoindirection="down">
                    <span></span>
                    </button>
                </div>
            </div>
        </div>
    </div>`

test('adds a todo element to the dom', () => {
    const componentRootElement = document.createElement('div');
    const todoList = document.createElement('div');
    componentRootElement.setAttribute('data-component', 'todo')
    todoList.setAttribute('data-todo', 'todoList');
    document.body.appendChild(componentRootElement);
    componentRootElement.appendChild(todoList);

    const regex = new RegExp(' ', 'g');
    const todoListElement = document.querySelector('[data-todo="todoList"]') as HTMLDivElement;

    renderAllTodos(todos, todoListElement)
    expect(todoList.innerHTML.replace(regex, '')).toEqual(resultHTML.replace(regex, ''));
})