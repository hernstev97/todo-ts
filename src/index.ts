import '../css/style.pcss';
import addTodoElementToDom from "../util/addElementToDom";
import TodoItem from "../interfaces/TodoItem";
import { setTodoItemInLocalStorage } from "../util/todoItemsInlocalStorage";
import setFontSizeForEachTodo from "../util/setFontSizeForEachTodo";

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

        addTodoElementToDom(todoItem.id, todoItem.title, todoItem.completed);

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

    checkboxes.forEach(check => {
        check.addEventListener('change', (event) => {
            const element = event.currentTarget as Element;
            const id = element?.getAttribute('data-id');
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