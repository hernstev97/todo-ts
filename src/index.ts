// Funktionale Vorgaben
// 	@todo editieren
// 	einfügen
// 	@todo löschen
// 	@todo Erledigt-Status
// 	@todo Sortierung mit Buttons (arrow up / down)
// 	Daten sollten im Local Storage abgespeichert werden
// 	Responsive
// 	    ⁃	mobile: 360x
// 	    ⁃	tablet: 720
// 	    ⁃	desktop: 1280px
// 	REM statt pixel verwenden
// 	    ⁃	mobile 1rem: 16px
// 	    ⁃	Tablet: 18px
// 	    ⁃	desktop: 20px
//  @todo Sortierung via Drag'n'Drop
//
// Technische Vorgaben
// 	•	jQuery, css framework verboten
// 	•	keine Libs außer Webpack zum Projekt aufsetzen (Webpack, gulp, parcel)
// 	•	@todo CSS: PostCSS verwenden
// 	•	plain javascript
// 	•	?typescript
// 	•	Kompatibilität: Reichen die aktuellsten Browser (Chrome, Firefox, Safari und ggf. Edge)
// ?jest test, wenn genug zeit

import '../css/style.pcss';
import addTodoElementToDom from "../util/addElementToDom";
import TodoItem from "../interfaces/TodoItem";
import {
    setTodoItemInLocalStorage,
    getTodoItemsInLocalStorage
} from "../util/todoItemsInlocalStorage";
import getFontSize from "../util/getFontSize";

let todoItems: TodoItem[] = [];

const app = document.querySelector('.todo-app');

if (app !== null) {
    const getLocalStorage = window.localStorage.getItem('todoItems');
    if (
        getLocalStorage !== null
        && getLocalStorage !== 'undefined'
        && getLocalStorage !== ''
    ) {
        todoItems = JSON.parse(getLocalStorage);
        const reversedTodos = [...todoItems].reverse();
        reversedTodos.forEach((item) => {
            addTodoElementToDom(item.id, item.title);
        })
    }

    const removeAllItemsButton = document.querySelector('.remove-all-items') as HTMLButtonElement;

    const inputField = app.querySelector('.todo__input-field') as HTMLInputElement;
    const form = app.querySelector('.todo__input-form') as HTMLFormElement;
    const checkboxes = app.querySelectorAll('.todo__item-title input[type="checkbox"]');
    let allTodos = app.querySelectorAll('.todo');
    let inputState: string;
    const limit = 100;

    inputField.addEventListener('input', (event) => {
        const input = event?.target as HTMLInputElement;
        inputState = input.value;
    })

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (todoItems.length >= limit) {
            alert('Only 100 entries are possible at the moment.')
            return;
        }
        const todoItem: TodoItem = {
            id: Math.floor(Math.random() * limit),
            title: inputState,
            completed: false,
        }

        addTodoElementToDom(todoItem.id, todoItem.title);

        todoItems.unshift(todoItem);

        setTodoItemInLocalStorage(todoItems);
        inputField.value = '';
        allTodos = app.querySelectorAll('.todo');
    })

    removeAllItemsButton.addEventListener('click', (event) => {
        event.preventDefault();

        window.localStorage.setItem('todoItems', '');
        todoItems = [];
        allTodos.forEach(todo => {
            todo.remove();
        })
    })

    allTodos.forEach(todo => {
        const text = todo.querySelector('.todo__item-label') as HTMLParagraphElement;

        console.log("textt.style.fontSize", text.style)

        if (text.textContent)
            text.style.fontSize = getFontSize(text, 'desktop')
    })
}

// render components via js
// build componentes in external files as functions -> todoItem(id, title, completed)

// maybe create a fake state with a list of all todoItems?

// insert
// get the value from the input field via onchange event
// on submit fill component with value, new id and completed = false
// create component

// delete
// with click on a button ...

// edit
// dblclick on text
// remove text and place input field with same value
// get the value from the input field via onchange event
// on submit fill component with new text value

// done
// set checkbox to true
// then change completed to true
// change classname of component

// sort
// use array function

// drag & drop
// click and hold & only works while holding
// safe initial position of element while holding
// get target element via event
// creates placeholder element at exact coordinates
// dragged element follows cursor from center of element
// only y axis