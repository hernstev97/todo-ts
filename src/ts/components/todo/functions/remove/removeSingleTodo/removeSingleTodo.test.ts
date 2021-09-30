import { removeSingleTodo } from "./removeSingleTodo";
import { composedPath } from "../../../mock/composedPath";

const target = document.createElement('button');
target.setAttribute('data-id', 'uid#hkUMDh7L5Q')

const todoListBefore =
    `
    <div data-todo="todoList" class="todo-list">
        <div data-todo="todoItem" class="todo " data-id="uid#1au88E1O1n">
            <div class="todo__flex-container">
                <input data-todo="todoCompletedCheckbox" type="checkbox" data-id="uid#1au88E1O1n">
                <div class="todo__title" data-todo="todoTitle">
                    <p class="todo__label">1</p>
                    <input data-todo="editTodoInput" class="todo__edit" type="text" value="1">
                </div>
                <div class="todo__interaction-wrapper">
                    <button class="todo__move todo__move--up" data-id="uid#1au88E1O1n" data-movetodoindirection="up" disabled="">
                        <span></span>
                    </button>
                    <button data-todo="deleteSingleTodoButton" class="todo__item-delete" data-id="uid#1au88E1O1n"></button>
                    <button class="todo__move todo__move--down" data-id="uid#1au88E1O1n" data-movetodoindirection="down">
                        <span></span>
                    </button>
                </div>
            </div>
        </div>
        <div data-todo="todoItem" class="todo " data-id="uid#hkUMDh7L5Q">
            <div class="todo__flex-container">
                <input data-todo="todoCompletedCheckbox" type="checkbox" data-id="uid#hkUMDh7L5Q">
                <div class="todo__title" data-todo="todoTitle">
                    <p class="todo__label">2</p>
                    <input data-todo="editTodoInput" class="todo__edit" type="text" value="2">
                </div>
                <div class="todo__interaction-wrapper">
                    <button class="todo__move todo__move--up" data-id="uid#hkUMDh7L5Q" data-movetodoindirection="up">
                        <span></span>
                    </button>
                    <button data-todo="deleteSingleTodoButton" class="todo__item-delete" data-id="uid#hkUMDh7L5Q"></button>
                    <button class="todo__move todo__move--down" data-id="uid#hkUMDh7L5Q" data-movetodoindirection="down" disabled="">
                        <span></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

const todoListAfter =
    `
    <div data-todo="todoList" class="todo-list">
        <div data-todo="todoItem" class="todo " data-id="uid#1au88E1O1n">
            <div class="todo__flex-container">
                <input data-todo="todoCompletedCheckbox" type="checkbox" data-id="uid#1au88E1O1n">
                <div class="todo__title" data-todo="todoTitle">
                    <p class="todo__label">1</p>
                    <input data-todo="editTodoInput" class="todo__edit" type="text" value="1">
                </div>
                <div class="todo__interaction-wrapper">
                    <button class="todo__move todo__move--up" data-id="uid#1au88E1O1n" data-movetodoindirection="up" disabled="">
                        <span></span>
                    </button>
                    <button data-todo="deleteSingleTodoButton" class="todo__item-delete" data-id="uid#1au88E1O1n"></button>
                    <button class="todo__move todo__move--down" data-id="uid#1au88E1O1n" data-movetodoindirection="down">
                        <span></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

//`<button data-todo="deleteSingleTodoButton" class="todo__item-delete" data-id="uid#hkUMDh7L5Q"></button>`
test('removes only one todo from localStorage and the ui', () => {
    console.log('composedPath', composedPath());
    console.log('target', target as EventTarget);
    removeSingleTodo(target as EventTarget, composedPath());
    // @TEST does currently not equal
    expect(todoListBefore).toEqual(todoListAfter);
});