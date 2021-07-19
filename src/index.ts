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

import '../css/style.css';
import addTodoElementToDom from "../util/addElementToDom";
import TodoItem from "../interfaces/TodoItem";
import {
    setTodoItemInLocalStorage,
    getTodoItemsInLocalStorage
} from "../util/todoItemsInlocalStorage";

let todoitems: TodoItem[] = [];

const app = document.querySelector('.todo');

if (app !== null) {
    const getLocalStorage = window.localStorage.getItem('todoItems');
    if (getLocalStorage !== null && getLocalStorage !== 'undefined') {
        todoitems = JSON.parse(getLocalStorage);
        todoitems.forEach((item) => {
            addTodoElementToDom(item.id, item.title);
        })
    }
    
    console.log("todoitems", todoitems);


    const inputField = app.querySelector('.todo__input-field') as HTMLInputElement;
    const form = app.querySelector('.todo__input-form') as HTMLFormElement;
    const checkboxes = app.querySelectorAll('.todo__item-title input[type="checkbox"]');
    let inputState: string;

    inputField.addEventListener('input', (event) => {
        const input = event?.target as HTMLInputElement;
        inputState = input.value;
    })

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (todoitems.length >= 100) {
            alert('Only 100 entries are possible at the moment.')
            return;
        }
        const todoItem: TodoItem = {
            id: Math.floor(Math.random() * 100),
            title: inputState,
            completed: false,
        }

        addTodoElementToDom(todoItem.id, todoItem.title);

        todoitems = [todoItem, ...todoitems];

        setTodoItemInLocalStorage(todoitems);
    })


}

// render components via js
// build componentes in external files as functions -> todoItem(id, title, completed)

// maybe create a fake state with a list of all todoitems?

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