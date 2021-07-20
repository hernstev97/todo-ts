import '../css/style.pcss';
import addTodoElementToDom from "../util/addElementToDom";
import TodoItem from "../interfaces/TodoItem";
import { setTodoItemInLocalStorage } from "../util/todoItemsInlocalStorage";
import setFontSizeForEachTodo from "../util/setFontSizeForEachTodo";
import allItemsRemoveButtonVisibilityHandler from "../util/allItemsRemoveButtonVisibilityHandler";
import {assignBulkEventListeners, assignSingleEventListener} from "../util/eventListeners";

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
            addTodoElementToDom(item.id, item.title, item.completed);
        })
    }

    const removeAllItemsButton = document.querySelector('.remove-all-items') as HTMLButtonElement;
    const inputField = app.querySelector('.todo__input-field') as HTMLInputElement;
    const form = app.querySelector('.todo__input-form') as HTMLFormElement;
    const checkboxes = app.querySelectorAll('.todo__flex-container [type="checkbox"]');
    const deleteButtons = app.querySelectorAll('.todo__item-delete');
    let allTodos = app.querySelectorAll('.todo');
    let inputState: string;
    const limit = 10000;

    allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);

    assignSingleEventListener(inputField, 'input', (event) => {
        const input = event?.target as HTMLInputElement;
        inputState = input.value;
    })

    assignSingleEventListener(form, 'submit', (event) => {
        event.preventDefault();
        if (inputField.value.length === 0) {
            return;
        }

        if (todoItems.length >= limit) {
            alert(`Only ${limit} entries are possible at the moment.`)
            return;
        }
        const todoItem: TodoItem = {
            id: Math.floor(Math.random() * limit),
            title: inputState,
            completed: false,
        }

        addTodoElementToDom(todoItem.id, todoItem.title, todoItem.completed);

        todoItems.unshift(todoItem);

        setTodoItemInLocalStorage(todoItems);
        inputField.value = '';
        allTodos = app.querySelectorAll('.todo');
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    })

    assignSingleEventListener(removeAllItemsButton, 'click', (event) => {
        event.preventDefault();

        console.log("test");
        window.localStorage.setItem('todoItems', '');
        todoItems = [];
        allTodos.forEach(todo => {
            console.log("todo", todo)
            todo.remove();
        })
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    })

    assignBulkEventListeners(checkboxes, 'change', (event) => {
        const element = event.currentTarget as HTMLElement;
        const id = element.dataset.id;
        const currentTodo = todoItems.find(item => `${item.id}` === id);
        const parent = element.parentElement?.parentElement;

        if (currentTodo === undefined) return;

        currentTodo.completed = !currentTodo.completed;

        setTimeout(() => {
            if (currentTodo.completed)
                parent?.classList.add('todo--completed');
            else
                parent?.classList.remove('todo--completed');
        }, 200)


        setTodoItemInLocalStorage(todoItems);
    })
    
    // change eventlistener management
    // currently a page reload has to be done in order for
    // everything to work correctly after any interaction
    // @todo after each interaction remove and re-add eventlisteners
    // @todo also re-assign the nessecary variables with its new values
    assignBulkEventListeners(deleteButtons, 'click', (event) => {
        event.preventDefault();
        const target = event.currentTarget as HTMLButtonElement;
        const id = target.dataset.id;
        const parent = Array.from(allTodos).find(todo => todo.getAttribute('data-id') === id);
        const currentTodo = todoItems.find(item => `${item.id}` === id);
        const currentTodoIndex = currentTodo ? todoItems.indexOf(currentTodo) : -1;

        console.log("target", target)

        for (let i = 0; i < todoItems.length; i++) {
            if (i === currentTodoIndex) {
                todoItems.splice(i, 1);
            }
        }

        parent?.remove();
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
        setTodoItemInLocalStorage(todoItems);
    })

    // first gets the font size via a text length comparison
    // then sets it to a value between 0.8 and 1.4 depending on
    // deviceOutput and which threshold is passed
    setFontSizeForEachTodo(allTodos, 'mobile');


}

// maybe create a fake state with a list of all todoItems?

// delete
// with click on a button ...

// edit
// dblclick on text
// remove text and place input.pcss field with same value
// get the value from the input.pcss field via onchange event
// on submit fill component with new text value

// sort
// use array function

// drag & drop
// click and hold & only works while holding
// safe initial position of element while holding
// get target element via event
// creates placeholder element at exact coordinates
// dragged element follows cursor from center of element
// only y axis