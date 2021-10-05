import { removeAllTodos } from "./removeAllTodos";

let eventName = {
    preventDefault: () => {},
} as Event;

const todoListBefore =
    `
        <div data-todo="todoList" class="todo-list">
            <div data-todo="todoItem" class="todo " data-id="uid#40iV8A5404">
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
            </div>
            <div data-todo="todoItem" class="todo " data-id="uid#4tDI4v2Nb6">
                <div class="todo__flex-container">
                    <div class="todo__title" data-todo="todoTitle">
                        <p class="todo__label">Post reinholen</p>
                        <p class="todo__label todo__description"></p>
                    </div>
                    <div class="todo__interaction-wrapper">
                        <div class="data-modification-wrapper">
                            <input class="todo__interaction todo__interaction--done" data-todo="todoCompletedCheckbox" type="checkbox" data-id="uid#4tDI4v2Nb6">
                            <button data-todo="editTodoButton" data-modal="edit" class="todo__interaction todo__interaction--edit" data-id="uid#4tDI4v2Nb6">Bearbeiten</button>
                            <button data-todo="deleteSingleTodoButton" class="todo__interaction--delete todo__interaction" data-id="uid#4tDI4v2Nb6">Entfernen</button>
                        </div>
                        <div class="move-wrapper">
                            <button class="todo__move todo__move--up" data-id="uid#4tDI4v2Nb6" data-movetodoindirection="up">
                                <span></span>
                            </button>

                            <button class="todo__move todo__move--down" data-id="uid#4tDI4v2Nb6" data-movetodoindirection="down" disabled="">
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

const todoListAfter = `<div data-todo="todoList" class="todo-list"></div>`;
document.body.innerHTML = todoListBefore;
const allTodoElements: NodeListOf<Element> = document.querySelectorAll('[data-todo="todoItem"]');

test('removes all todos from the todo-list html element', () => {
    removeAllTodos(eventName, allTodoElements)
    expect(document.body.innerHTML.replace(/\s+/g, ''))
        .toEqual(todoListAfter.replace(/\s+/g, ''))
});