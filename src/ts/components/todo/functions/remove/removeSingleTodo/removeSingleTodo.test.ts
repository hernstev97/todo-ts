import { removeSingleTodo } from "./removeSingleTodo";
import { composedPath } from "../../../mock/composedPath";
import { setLocalStorage } from "../../../../../util/localStorage/localStorageUtility";
import { LocalStorageKeys } from "../../../../../enums/LocalStorageKeysEnum";
import addTodoElementToDom from "../../../utils/todoDomElementGeneration/addElementToDom";

const target = document.createElement('button');
target.setAttribute('data-id', 'uid#4tDI4v2Nb6')

const todoItems = [
    {
        "id":"uid#40iV8A5404",
        "title":"Einkaufen",
        "description":"Brot, Nudeln, Küchenrolle",
        "completed":false
    },
    {
        "id":"uid#4tDI4v2Nb6",
        "title":"Post reinholen",
        "description":"",
        "completed":false
    }
]

const componentRootElement = document.createElement('div');
const todoList = document.createElement('div');
componentRootElement.setAttribute('data-component', 'todo')
todoList.setAttribute('data-todo', 'todoList');
todoList.classList.add('todo-list');
document.body.appendChild(componentRootElement);
componentRootElement.appendChild(todoList);

const targetTodo = document.createElement('div');
todoList.appendChild(targetTodo);
targetTodo.setAttribute('data-todo', 'todoItem');
targetTodo.setAttribute('data-id', 'uid#40iV8A5404');
targetTodo.classList.add('todo');

targetTodo.innerHTML = `<div class="todo__flex-container">
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
                        </div>`

// @TEST the test does not yet work fully
// might be because the targetTodo is not exactly the same as in todoListElementAfter
test('removes only one todo from localStorage and the ui', () => {
    setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
    todoItems.forEach(todoItem => {
        addTodoElementToDom(todoItem);
    });

    const path = composedPath(targetTodo);

    removeSingleTodo(target as EventTarget, path);

    const todoListElementAfter = document.querySelector('[data-todo="todoList"]');
    const regex = new RegExp(' ', 'g');

    console.log('todoListElementAfter?.outerHTML', todoListElementAfter?.outerHTML)

    expect(todoListAfter.replace(regex, '')).toEqual(todoListElementAfter?.outerHTML.replace(regex, ''));
});