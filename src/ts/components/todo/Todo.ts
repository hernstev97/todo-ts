import TodoItem from "./interfaces/TodoItem";
import allItemsRemoveButtonVisibilityHandler from "./utils/allItemsRemoveButtonVisibilityHandler";
import { assignBulkEventListeners } from "../../util/assignBulkEventListeners";
import setFontSizeForEachTodo from "./utils/setFontSizeForEachTodo/setFontSizeForEachTodo";
import getDeviceOutput from "../../util/getDeviceOutput/getDeviceOutput";
import { getLocalStorage, setLocalStorage } from "../../util/localStorageUtility";
import addTodoElementToDom from "./utils/todoDomElementGeneration/addElementToDom";
import getUniqueId from "../../util/uniqueId/uniqueId";
import validateInput from "../../util/validateInput/validateInput";
import { renderAllTodos } from "./utils/renderAllTodos";
import { dispatchTodoCompletionEvent, handleTodoCompletion } from './functions/complete/complete'
import {
    dispatchRemoveSingleTodoEvent,
    dispatchRemoveAllTodoEvent,
    remove} from "./functions/remove/remove";
import {setDisabledSortButtons} from "./utils/setDisabledSortButtons/setDisabledSortButtons";
import {LocalStorageKeys} from "../../enums/LocalStorageKeysEnum";
import {dispatchMoveTodoEvent, handleMoveTodo} from "./functions/moving/moving";
import {dispatchEditTodoEvent, handleEditTodoLabel} from "./functions/edit/edit";
import {CustomTodoEvents} from "./enums/CustomTodoEventsEnum";
import {getElementId} from "./utils/getElementId/getElementId";

export const setInteractionElementsEvent = new CustomEvent(CustomTodoEvents.SET_INTERACTION_ELEMENTS)
export const setDisabledSortButtonsEvent = new CustomEvent(CustomTodoEvents.SET_DISABLED_SORT_BUTTONS)
export const bindEventsTodoSpecificEvent = new CustomEvent(CustomTodoEvents.BIND_EVENTS)
export const setInputStateEvent = new CustomEvent(CustomTodoEvents.SET_INPUT_STATE)

// todo move out of this file
export const dispatchSetInputState = (event: Event) => {
    event.currentTarget?.dispatchEvent(setInputStateEvent);
}

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

    const init = () => {
        buildTodosFromLocalStorage();
        setInteractionElements();
        bindEvents();
        document.dispatchEvent(setDisabledSortButtonsEvent);
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
        setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));
    }

    const bindEvents = () => {
        document.addEventListener(CustomTodoEvents.SET_INTERACTION_ELEMENTS, setInteractionElements)
        document.addEventListener(CustomTodoEvents.SET_DISABLED_SORT_BUTTONS, setDisabledSortButtons)
        document.addEventListener(CustomTodoEvents.BIND_EVENTS, bindTodoSpecificEvents)

        document.dispatchEvent(bindEventsTodoSpecificEvent);

        addTodoTextInput.addEventListener( 'input', dispatchSetInputState);
        addTodoTextInput.addEventListener(CustomTodoEvents.SET_INPUT_STATE, setInputState)
        addTodoFormElement.addEventListener('submit', handleFormSubmit);

        removeAllItemsButton.addEventListener('click', dispatchRemoveAllTodoEvent);
        removeAllItemsButton.addEventListener(CustomTodoEvents.REMOVE_ALL, remove().removeAll);
        document.addEventListener(CustomTodoEvents.REMOVE_CLEANUP, removeCleanUp);

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

    const bindTodoSpecificEvents = () => {
        // delete
        assignBulkEventListeners(deleteSingleTodoButtonList, 'click', dispatchRemoveSingleTodoEvent);
        assignBulkEventListeners(deleteSingleTodoButtonList, CustomTodoEvents.REMOVE_SINGLE, remove().removeSingle);

        // complete
        assignBulkEventListeners(todoDoneCheckboxList, 'change', dispatchTodoCompletionEvent);
        assignBulkEventListeners(todoDoneCheckboxList, CustomTodoEvents.TOGGLE_COMPLETE, handleTodoCompletion);

        // move/sort
        assignBulkEventListeners(moveTodoInDirectionButtonList, 'click', dispatchMoveTodoEvent);
        assignBulkEventListeners(moveTodoInDirectionButtonList, CustomTodoEvents.MOVE, handleMoveTodo);

        // edit
        assignBulkEventListeners(todoTitleList, 'dblclick', dispatchEditTodoEvent);
        assignBulkEventListeners(todoTitleList, CustomTodoEvents.EDIT, handleEditTodoLabel);
    }

    // todo needs to be in here
    // general functions
    const buildTodosFromLocalStorage = () => {
        const todoItemsFromStorage = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
        todoItems = todoItemsFromStorage === undefined ? [] : todoItemsFromStorage;
        renderAllTodos(todoItems, todoList);
    }

    // todo needs to be in here
    const setInteractionElements = () => {
        console.log("set interaction elements");
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
        todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
        uniqueIdForThisTodo = getUniqueId();

        const todoItem: TodoItem = {
            id: uniqueIdForThisTodo,
            title: inputState,
            completed: false,
        }

        todoItems.push(todoItem);
        setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
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
        document.dispatchEvent(setInteractionElementsEvent)
        giveNewTodoEventListeners(newTodo, indexForNewItem)
    }

    // todo doesnt need to be in here?
    const giveNewTodoEventListeners = (newTodo: TodoItem, index: number) => {
        todoDoneCheckboxList[index].addEventListener('change', dispatchTodoCompletionEvent);
        todoDoneCheckboxList[index].addEventListener(CustomTodoEvents.TOGGLE_COMPLETE, handleTodoCompletion);

        deleteSingleTodoButtonList[index].addEventListener('click', dispatchRemoveSingleTodoEvent)
        deleteSingleTodoButtonList[index].addEventListener(CustomTodoEvents.REMOVE_SINGLE, remove().removeSingle)

        todoTitleList[index].addEventListener('dblclick', dispatchEditTodoEvent);
        todoTitleList[index].addEventListener(CustomTodoEvents.EDIT, handleEditTodoLabel);

        moveTodoInDirectionButtonList.forEach(button => {
            if (getElementId(button) === newTodo.id) {
                button.addEventListener('click', dispatchMoveTodoEvent);
                button.addEventListener(CustomTodoEvents.MOVE, handleMoveTodo);
            }
        })
    }

    const handleFormSubmit = (event: Event) => {
        event.preventDefault();
        if (validateInput(inputState)) {
            addTodoItem();
            createNewTodoDOMElement();
            allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
            document.dispatchEvent(setDisabledSortButtonsEvent);
        }
    }

    const removeCleanUp = () => {
        todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');

        if (todoItems.length === 0)
            uniqueIdForThisTodo = '';
    }

    return { init };
}