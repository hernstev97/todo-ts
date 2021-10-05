import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import { setLocalStorage } from "../../../../util/localStorage/localStorageUtility";
import addTodoElementToDom from "../todoDomElementGeneration/addElementToDom";
import { setDisabledSortButtons } from "./setDisabledSortButtons";

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

const firstMoveButton =
    `<button class="todo__move todo__move--up" data-id="uid#40iV8A5404" data-movetodoindirection="up" disabled="">
        <span></span>
    </button>`;

const lastMoveButton =
    `<button class="todo__move todo__move--down" data-id="uid#4tDI4v2Nb6" data-movetodoindirection="down" disabled="">
        <span></span>
    </button>`;

describe('sets the first and last of all sort buttons as disabled', () => {
    const componentRootElement = document.createElement('div');
    const todoList = document.createElement('div');
    componentRootElement.setAttribute('data-component', 'todo')
    todoList.setAttribute('data-todo', 'todoList');
    document.body.appendChild(componentRootElement);
    componentRootElement.appendChild(todoList);

    setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
    todoItems.forEach(todoItem => {
        addTodoElementToDom(todoItem);
    });

    setDisabledSortButtons()

    const regex = new RegExp(' ', 'g');
    const moveButtons = document.querySelectorAll("[data-moveTodoInDirection]");

    test('sets the first of all sort buttons as disabled', () => {
        expect(moveButtons[0].outerHTML.replace(regex, '')).toEqual(firstMoveButton.replace(regex, ''));
    })

    test('sets the last of all sort buttons as disabled', () => {
        expect(moveButtons[moveButtons.length - 1].outerHTML.replace(regex, '')).toEqual(lastMoveButton.replace(regex, ''));
    })
})