import TodoItem from "./interfaces/TodoItem";
import allItemsRemoveButtonVisibilityHandler from "./utils/allItemsRemoveButtonVisibilityHandler";
import setFontSizeForEachTodo from "./utils/setFontSizeForEachTodo/setFontSizeForEachTodo";
import getDeviceOutput from "../../util/getDeviceOutput/getDeviceOutput";
import { getLocalStorage } from "../../util/localStorage/localStorageUtility";
import { renderAllTodos } from "./utils/renderAllTodos/renderAllTodos";
import { remove } from "./functions/remove/remove";
import { setDisabledSortButtons } from "./utils/setDisabledSortButtons/setDisabledSortButtons";
import { LocalStorageKeys } from "../../enums/LocalStorageKeysEnum";
import { CustomTodoEvents } from "./enums/CustomTodoEventsEnum";
import {
    bindEventsTodoSpecificEvent,
    setDisabledSortButtonsEvent,
    dispatchRemoveAllTodoEvent,
    fireGlobalEvent, 
    dispatchAddTodoEvent,
} from "./events/CustomEvents";
import { bindTodoSpecificEvents } from "./utils/bindTodoSpecificEvents/bindTodoSpecificEvents";
import { todoModal } from "./functions/modal/todoModal";

export const todo = () => {
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    const removeAllItemsButton = componentRoot.querySelector('[data-todo="removeAllItemsButton"]') as HTMLButtonElement;
    const todoList = componentRoot.querySelector('[data-todo="todoList"]') as HTMLDivElement
    const addTodoButton = componentRoot.querySelector('[data-todo="addTodoButton"]') as HTMLButtonElement;
    let todoElementNodeList: NodeListOf<Element>;
    let todoDoneCheckboxList: HTMLInputElement[];
    let deleteSingleTodoButtonList: HTMLButtonElement[];
    let editTodoButtonList: HTMLButtonElement[];
    let moveTodoInDirectionButtonList: HTMLButtonElement[];
    let todoTitleList: HTMLDivElement[];
    let todoItems: TodoItem[] = [];
    let timeout: number;
    let uniqueIdForThisTodo: string = '';

    const init = () => {
        buildTodosFromLocalStorage();
        setInteractionElements();
        bindEvents();
        fireGlobalEvent(setDisabledSortButtonsEvent);
        allItemsRemoveButtonVisibilityHandler(removeAllItemsButton);
        setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));
    }

    const buildTodosFromLocalStorage = () => {
        const todoItemsFromStorage = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
        todoItems = todoItemsFromStorage === undefined ? [] : todoItemsFromStorage;
        renderAllTodos(todoItems, todoList);
    }

    const setInteractionElements = () => {
        todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');
        todoDoneCheckboxList = Array.from(componentRoot.querySelectorAll('[data-todo="todoCompletedCheckbox"]')) as HTMLInputElement[];
        deleteSingleTodoButtonList = Array.from(componentRoot.querySelectorAll('[data-todo="deleteSingleTodoButton"]')) as HTMLButtonElement[];
        editTodoButtonList = Array.from(componentRoot.querySelectorAll('[data-todo="editTodoButton"]')) as HTMLButtonElement[];
        moveTodoInDirectionButtonList = Array.from(componentRoot.querySelectorAll('[data-moveTodoInDirection]')) as HTMLButtonElement[];
        todoTitleList = Array.from(componentRoot.querySelectorAll('[data-todo="todoTitle"]')) as HTMLDivElement[];
    }

    const bindEvents = () => {
        document.addEventListener(CustomTodoEvents.SET_INTERACTION_ELEMENTS, setInteractionElements)
        document.addEventListener(CustomTodoEvents.SET_DISABLED_SORT_BUTTONS, setDisabledSortButtons)
        document.addEventListener(CustomTodoEvents.BIND_EVENTS, () => {
            bindTodoSpecificEvents({
                doneCheckboxList: todoDoneCheckboxList,
                deleteButtonList: deleteSingleTodoButtonList,
                editButtonList: editTodoButtonList,
                moveInDirectionButtonList: moveTodoInDirectionButtonList,
                titleList: todoTitleList
            })
        })

        document.addEventListener(CustomTodoEvents.SET_DISABLED_SORT_BUTTONS, setDisabledSortButtons)

        fireGlobalEvent(bindEventsTodoSpecificEvent);

        addTodoButton.addEventListener('click', dispatchAddTodoEvent);
        addTodoButton.addEventListener(CustomTodoEvents.ADD, todoModal().open);

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

    const removeCleanUp = () => {
        todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');

        if (todoItems.length === 0)
            uniqueIdForThisTodo = '';
    }

    return { init };
}