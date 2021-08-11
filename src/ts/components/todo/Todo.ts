import TodoItem from "../../interfaces/TodoItem";
import allItemsRemoveButtonVisibilityHandler from "./utils/allItemsRemoveButtonVisibilityHandler";
import {assignBulkEventListeners} from "../../util/assignBulkEventListeners";
import setFontSizeForEachTodo from "./utils/setFontSizeForEachTodo/setFontSizeForEachTodo";
import getDeviceOutput from "../../util/getDeviceOutput/getDeviceOutput";
import { getLocalStorage, setLocalStorage } from "../../util/localStorageUtility";
import addTodoElementToDom from "./utils/todoDomElementGeneration/addElementToDom";
import { removeDisabledAttribute, setDisabledAttribute } from "../../util/disabledAttributeUtility";
import getUniqueId from "../../util/uniqueId/uniqueId";
import validateInput from "../../util/validateInput/validateInput";
import { renderAllTodos } from "./utils/renderAllTodos";
import { getTodoItemById } from "./utils/getTodoItemById";
import {handleCheckboxChange, handleTodoCompletion} from './checkbox/checkbox'
import {getElementId} from "./utils/getElementId/getElementId";
import {swapTodoIndexByDirection} from "./utils/swapTodoIndexByDirection/swapTodoIndexByDirection";
import {getSelectedDirection} from "./utils/getSelectedDirection/getSelectedDirection";

export const todo = () => {
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    const removeAllItemsButton = componentRoot.querySelector('[data-todo="removeAllItemsButton"]') as HTMLButtonElement;
    const addTodoTextInput = componentRoot.querySelector('[data-todo="addTodoTextInput"]') as HTMLInputElement;
    const addTodoFormElement = componentRoot.querySelector('[data-todo="addTodoForm"]') as HTMLFormElement;
    const todoList = componentRoot.querySelector('[data-todo="todoList"]') as HTMLDivElement
    let todoElementNodeList: NodeListOf<Element>;
    let todoDoneCheckboxList: HTMLInputElement[];
    let deleteSingleTodoButtonList: HTMLButtonElement[];
    let moveTodoInDirectionButtonList: HTMLButtonElement[];
    let todoTitleList: HTMLDivElement[];
    // general
    let todoItems: TodoItem[] = [];
    let inputState: string = '';
    let timeout: number;
    let uniqueIdForThisTodo: string = '';
    // edit
    let currentTodoId: string | null;
    let modifiedTodoItems: TodoItem[] = [];
    let indexOfEditableTodoItem: number;
    let selectedEditableTodoItem: TodoItem | undefined;
    let currentlyEditedTitle: Element;

    // const deleteEvent = new CustomEvent('delete')
    const init = () => {
        buildTodosFromLocalStorage();
        setInteractionElements();
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
        setDisabledSortButtons();
        bindEvents();
        setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));
    }

    const bindEvents = () => {
        addTodoTextInput.addEventListener( 'input', setInputState);

        addTodoFormElement.addEventListener('submit', handleFormSubmit);

        removeAllItemsButton.addEventListener('click', handleDeleteAllButtonClick);

        assignBulkEventListeners(todoDoneCheckboxList, 'change', handleCheckboxChange);

        assignBulkEventListeners(todoDoneCheckboxList, 'toggleComplete', handleTodoCompletion);

        assignBulkEventListeners(deleteSingleTodoButtonList, 'click', handleDeleteTodo);

        // deleteSingleTodoButtonList[0].addEventListener('delete', deleteTest as EventListener)

        assignBulkEventListeners(moveTodoInDirectionButtonList, 'click', handleMoveTodo);

        assignBulkEventListeners(todoTitleList, 'dblclick', handleEditTodoLabel);

        window.addEventListener('resize', () => {
            clearTimeout(timeout);

            timeout = window.setTimeout(() => {
                // first gets the font size via a text length comparison
                // then sets it to a value between 0.8 and 1.4 depending on
                // deviceOutput and which threshold is passed
                setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));
            }, 250);
        });
    }

    // general functions
    const buildTodosFromLocalStorage = () => {
        const todoItemsFromStorage = getLocalStorage('todoItems');
        todoItems = todoItemsFromStorage === undefined ? [] : todoItemsFromStorage;
        renderAllTodos(todoItems, todoList);
    }

    const setInteractionElements = () => {
        todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');
        todoDoneCheckboxList = Array.from(componentRoot.querySelectorAll('[data-todo="todoCompletedCheckbox"]')) as HTMLInputElement[];
        deleteSingleTodoButtonList = Array.from(componentRoot.querySelectorAll('[data-todo="deleteSingleTodoButton"]')) as HTMLButtonElement[];
        moveTodoInDirectionButtonList = Array.from(componentRoot.querySelectorAll('[data-moveTodoInDirection]')) as HTMLButtonElement[];
        todoTitleList = Array.from(componentRoot.querySelectorAll('[data-todo="todoTitle"]')) as HTMLDivElement[];
    }

    // todo needs to be in here
    const setInputState = (event: Event) => {
        const input = event?.target as HTMLInputElement;
        inputState = input.value ?? '';
    }

    const addTodoItem = () => {
        if (addTodoTextInput.value.length === 0) return;

        uniqueIdForThisTodo = getUniqueId();

        const todoItem: TodoItem = {
            id: uniqueIdForThisTodo,
            title: inputState,
            completed: false,
        }

        todoItems.push(todoItem);
        setLocalStorage('todoItems', todoItems);
        addTodoTextInput.value = '';
        inputState = '';
    }

    // todo doesnt need to be in here
    const createNewTodoDOMElement = () => {
        const indexForNewItem = todoItems.length - 1
        const newTodo = todoItems[indexForNewItem];

        addTodoElementToDom({
            id: uniqueIdForThisTodo,
            title: newTodo.title,
            completed: newTodo.completed,
        });
        setInteractionElements();
        giveNewTodoEventListeners(newTodo, indexForNewItem)
    }

    // todo doesnt need to be in here?
    const giveNewTodoEventListeners = (newTodo: TodoItem, index: number) => {
        todoDoneCheckboxList[index].addEventListener('change', handleTodoCompletion)
        deleteSingleTodoButtonList[index].addEventListener('click', handleDeleteTodo)
        todoTitleList[index].addEventListener('dblclick', handleEditTodoLabel);
        moveTodoInDirectionButtonList.forEach(button => {
            if (getElementId(button) === newTodo.id)
                button.addEventListener('click', handleMoveTodo);
        })
    }

    const handleFormSubmit = (event: Event) => {
        event.preventDefault();
        if (validateInput(inputState)) {
            addTodoItem();
            createNewTodoDOMElement();
            allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
            setDisabledSortButtons();
        }
    }

    // completing a todoItem
    // const toggleTodoComplete = (event: Event) => {
    //     const element = event.currentTarget as HTMLElement;
    //     const id = element.dataset.id;
    //     const currentTodo = getTodoItemById(id);
    //     const parent = element.parentElement?.parentElement;
    //
    //     if (currentTodo === undefined) return;
    //
    //     if (parent) {
    //         currentTodo.completed = !currentTodo.completed;
    //
    //         if (currentTodo.completed)
    //             parent.classList.add('todo--completed');
    //         else
    //             parent.classList.remove('todo--completed');
    //     }
    //
    //     setLocalStorage('todoItems', todoItems);
    // }

    // deleting all todoItems
    const deleteAllTodos = (event: Event) => {
        event.preventDefault();

        uniqueIdForThisTodo = '';
        todoItems = [];
        setLocalStorage('todoItems', todoItems)
        todoElementNodeList.forEach(todo => {
            todo.remove();
        })
    }

    const handleDeleteAllButtonClick = (event: Event) => {
        deleteAllTodos(event)
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    }

    // deleting a single todoItem
    const deleteSingleTodo = (event: Event) => {
        event.preventDefault();
        const target = event.currentTarget as HTMLButtonElement;
        const id = target.dataset.id;
        const parent = Array.from(todoElementNodeList).find(todo => getElementId(todo) === id);
        const toDeleteTodo = getTodoItemById(todoItems, id);
        const toDeleteTodoIndex = toDeleteTodo ? todoItems.indexOf(toDeleteTodo) : -1;

        for (let todoIndex = 0; todoIndex < todoItems.length; todoIndex++) {
            if (todoIndex === toDeleteTodoIndex)
                todoItems.splice(todoIndex, 1);
        }

        if (parent) parent.remove();

        setLocalStorage('todoItems', todoItems);
        todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');

        if (todoItems.length === 0) {
            uniqueIdForThisTodo = '';
        }
    }

    const handleDeleteTodo = (event: Event) => {
        // deleteSingleTodoButtonList[0].dispatchEvent(deleteEvent)
        deleteSingleTodo(event)
        setDisabledSortButtons();
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    }

    // const deleteTest = (event: CustomEvent<Record<string, string | [] | {}>>) => {
    //     const deletable = event.target as Element;
    //     const deleteId = getElementId(deletable);
    //     // @ts-ignore todo why does path not exist on CustomEvent?
    //     const parent = event.path[3];
    //     const toDeleteTodo = getTodoItemById(deleteId);
    //     const toDeleteTodoIndex = toDeleteTodo ? todoItems.indexOf(toDeleteTodo) : -1;
    //
    //     for (let todoIndex = 0; todoIndex < todoItems.length; todoIndex++) {
    //         if (todoIndex === toDeleteTodoIndex)
    //             todoItems.splice(todoIndex, 1);
    //     }
    //
    //     if (parent) parent.remove();
    //
    //     setLocalStorage('todoItems', todoItems);
    //     todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');
    //
    //     if (todoItems.length === 0) {
    //         uniqueIdForThisTodo = '';
    //     }
    //     console.log('lol', event, deletable, parent, deleteId);
    // }

    // editing a todoItem
    const handleEditTodoLabel = (event: Event) => {
        currentlyEditedTitle = event.currentTarget as Element;
        currentlyEditedTitle.classList.add('todo__title--edit');
        modifiedTodoItems = Array.from(todoItems)
        const editTodoInput = currentlyEditedTitle.querySelector('[data-todo="editTodoInput"]') as HTMLInputElement;
        const parent = currentlyEditedTitle?.parentElement?.parentElement;
        currentTodoId = parent ? getElementId(parent) : '';
        selectedEditableTodoItem = getTodoItemById(todoItems, currentTodoId);

        if (editTodoInput && selectedEditableTodoItem) {
            indexOfEditableTodoItem = todoItems.indexOf(selectedEditableTodoItem);
            editTodoInput.focus();
            editTodoInput.setSelectionRange(editTodoInput.value.length, editTodoInput.value.length);
            editTodoInput.addEventListener('input', setInputState);
            editTodoInput.addEventListener('keydown', handleEditSubmit);
            editTodoInput.addEventListener('keyup', (event) => {
                if (event.key === "Enter")
                    removeEditInput(editTodoInput);
                if (event.key === "Escape")
                    cancelEdit(editTodoInput);
            });
            editTodoInput.addEventListener('blur', () => { cancelEdit(editTodoInput); });
        }
    }

    const removeEditInput = (input: HTMLInputElement) => {
        currentlyEditedTitle.classList.remove('todo__title--edit');
        input.removeEventListener('keydown', handleEditSubmit);
        input.removeEventListener('input', setInputState);
    }

    const handleEditSubmit = (event: Event | KeyboardEvent) => {
        const { key } = event as KeyboardEvent;
        const todoLabel = currentlyEditedTitle.querySelector('p');
        const editTodoInput = currentlyEditedTitle.querySelector('[data-todo="editTodoInput"]') as HTMLInputElement;
        const newTitle = inputState.length > 0 ? inputState : editTodoInput.value;

        if (key === "Enter" && selectedEditableTodoItem && todoLabel && currentTodoId && validateInput(newTitle)) {
            modifiedTodoItems[indexOfEditableTodoItem] = {
                id: currentTodoId,
                title: newTitle,
                completed: selectedEditableTodoItem.completed
            };

            todoLabel.textContent = newTitle;
            todoItems = modifiedTodoItems;
            setLocalStorage('todoItems', modifiedTodoItems);
            setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));
        }
    }

    const cancelEdit = (input: HTMLInputElement) => {
        input.value = currentlyEditedTitle.querySelector('p')?.textContent as string;
        removeEditInput(input);
    }

    const setDisabledSortButtons = () => {
        if (todoItems.length > 0) {
            const firstTodo = todoElementNodeList[0];
            const lastTodo = todoElementNodeList[todoElementNodeList.length - 1];
            todoElementNodeList.forEach(todo => {
                removeDisabledAttribute(todo, '[data-moveTodoInDirection="up"]')
                removeDisabledAttribute(todo, '[data-moveTodoInDirection="down"]')
            })
            setDisabledAttribute(firstTodo, '[data-moveTodoInDirection="up"]')
            setDisabledAttribute(lastTodo, '[data-moveTodoInDirection="down"]')
        }
    }

    // moving
    const handleMoveTodo = (event: Event) => {
        moveTodoInDirection(event);
        renderAllTodos(todoItems, todoList);
        setInteractionElements();
        setDisabledSortButtons();
        setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));

        // here all listeners for elements inside a todoElement have to be set again
        // because within the renderAllTodos function the innerHTML of the todolist ist emptied
        // which deletes all listeners as well
        assignBulkEventListeners(todoDoneCheckboxList, 'change', handleTodoCompletion);
        assignBulkEventListeners(deleteSingleTodoButtonList, 'click', handleDeleteTodo);
        assignBulkEventListeners(moveTodoInDirectionButtonList, 'click', handleMoveTodo);
        assignBulkEventListeners(todoTitleList, 'dblclick', handleEditTodoLabel);

        setLocalStorage('todoItems', todoItems);
    }

    const moveTodoInDirection = (event: Event) => {
        const moveButton = event.currentTarget as HTMLButtonElement;
        // todo find a way to find the index easier
        const buttonId = getElementId(moveButton);
        const todoItemToMove = getTodoItemById(todoItems, buttonId) as TodoItem;
        const indexOfTodoItemToMove = todoItems.indexOf(todoItemToMove);

        if (getSelectedDirection(moveButton, 'up'))
            todoItems = swapTodoIndexByDirection(todoItems, indexOfTodoItemToMove, 'up')
        else if (getSelectedDirection(moveButton, 'down'))
            todoItems = swapTodoIndexByDirection(todoItems, indexOfTodoItemToMove, 'down')
    }

    // todo try getting a better name
    /* todo add following custom events:
    *   delete: click on delete button on a single todoElement
    *   sort: click on any of the two sort buttons on a single todoElement
    *   edit: double click on the label of a single todoElement
    *   complete: click on the checkbox of a single todoElement
    * */

    // todo: every function should only do one thing
    // todo: functions should contain statements at the same level
    //  so low-level statements and high-level statements should not be in one function

    return { init };
}