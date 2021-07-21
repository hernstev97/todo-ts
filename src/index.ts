import '../css/style.pcss';
import addTodoElementToDom from "../util/addElementToDom";
import TodoItem from "../interfaces/TodoItem";
import { setTodoItemInLocalStorage } from "../util/todoItemsInlocalStorage";
import setFontSizeForEachTodo from "../util/setFontSizeForEachTodo";
import allItemsRemoveButtonVisibilityHandler from "../util/allItemsRemoveButtonVisibilityHandler";
import {assignBulkEventListeners, assignSingleEventListener, removeBulkEventListeners} from "../util/eventListeners";

let todoItems: TodoItem[] = [];

const app = document.querySelector('.todo-app');

// todo decide if Class based system might be better

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
    let allTodos = app.querySelectorAll('.todo');
    let checkboxes = app.querySelectorAll('.todo__flex-container [type="checkbox"]');
    let deleteButtons = app.querySelectorAll('.todo__item-delete');
    let inputState: string;
    const limit = 10000;

    // hides or shows the button for deleting all todos
    // shows it only if at least 1 todoitem exists
    allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);

    function setInputState(event: Event) {
        const input = event?.target as HTMLInputElement;
        inputState = input.value;
    }

    function changeCompletedState(event: Event) {
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
    }

    function deleteAllTodoItems(event: Event) {
        event.preventDefault();

        window.localStorage.setItem('todoItems', '');
        todoItems = [];
        allTodos.forEach(todo => {
            todo.remove();
        })
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    }

    function deleteSingleTodoItem(event: Event) {
        event.preventDefault();
        const target = event.currentTarget as HTMLButtonElement;
        const id = target.dataset.id;
        const parent = Array.from(allTodos).find(todo => todo.getAttribute('data-id') === id);
        const currentTodo = todoItems.find(item => `${item.id}` === id);
        const currentTodoIndex = currentTodo ? todoItems.indexOf(currentTodo) : -1;

        for (let i = 0; i < todoItems.length; i++) {
            if (i === currentTodoIndex) {
                todoItems.splice(i, 1);
            }
        }

        parent?.remove();
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
        setTodoItemInLocalStorage(todoItems);
    }

    function generateTodoAfterSubmit(event: Event) {
        event.preventDefault();
        if (inputField.value.length === 0 || app === null) {
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

        checkboxes = app.querySelectorAll('.todo__flex-container [type="checkbox"]');
        removeBulkEventListeners(checkboxes, 'change', changeCompletedState);
        assignBulkEventListeners(checkboxes, 'change', changeCompletedState);

        deleteButtons = app.querySelectorAll('.todo__item-delete');
        removeBulkEventListeners(deleteButtons, 'click', deleteSingleTodoItem)
        assignBulkEventListeners(deleteButtons, 'click', deleteSingleTodoItem)
    }

    assignSingleEventListener(inputField, 'input', setInputState)

    assignSingleEventListener(form, 'submit', generateTodoAfterSubmit)

    assignBulkEventListeners(checkboxes, 'change', changeCompletedState);

    assignSingleEventListener(removeAllItemsButton, 'click', deleteAllTodoItems)

    assignBulkEventListeners(deleteButtons, 'click', deleteSingleTodoItem)

    // first gets the font size via a text length comparison
    // then sets it to a value between 0.8 and 1.4 depending on
    // deviceOutput and which threshold is passed
    // todo add resize listener that sets a variable 'deviceOutput'
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