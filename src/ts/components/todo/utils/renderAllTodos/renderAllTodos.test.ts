import { renderAllTodos } from "./renderAllTodos";
import TodoItem from "../../interfaces/TodoItem";

const todo: TodoItem = {
    id: 'uid#7XXQ1c5eO1',
    title: 'Testing Title',
    completed: false,
}

const todos = [todo];

const resultHTML: string =
    `
    <div data-todo="todoItem" class="todo " data-id="uid#7XXQ1c5eO1">
        <div class="todo__flex-container">
            <input data-todo="todoCompletedCheckbox" type="checkbox" data-id="uid#7XXQ1c5eO1">  
            <div class="todo__title" data-todo="todoTitle">
                <p class="todo__label">Testing Title</p>
            </div>
            <div class="todo__interaction-wrapper">
                <button class="todo__move todo__move--up" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="up">
                    <span></span>
                </button>
                <button data-todo="deleteSingleTodoButton" class="todo__item-delete" data-id="uid#7XXQ1c5eO1"></button>
                <button class="todo__move todo__move--down" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="down">
                    <span></span>
                </button>
            </div>
        </div>
    </div>
    `

test('adds a todo element to the dom', () => {
    document.body.innerHTML = `<div class="todo-list"></div>`
    const todoList = document.querySelector('.todo-list') as HTMLDivElement;
    renderAllTodos(todos, todoList)
    expect(todoList.innerHTML.replace(/\s+/g, ''))
        .toEqual(resultHTML.replace(/\s+/g, ''));
})