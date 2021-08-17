import TodoItem from "../../interfaces/TodoItem";
import setFontSizeForEachTodo from "../../utils/setFontSizeForEachTodo/setFontSizeForEachTodo";
import getDeviceOutput from "../../../../util/getDeviceOutput/getDeviceOutput";
import { renderAllTodos } from "../../utils/renderAllTodos";
import { getLocalStorage, setLocalStorage } from "../../../../util/localStorageUtility";
import { getElementId } from "../../utils/getElementId/getElementId";
import { getTodoItemById } from "../../utils/getTodoItemById";
import { getSelectedDirection } from "../../utils/getSelectedDirection/getSelectedDirection";
import { swapTodoIndexByDirection } from "../../utils/swapTodoIndexByDirection/swapTodoIndexByDirection";
import {
    bindEventsTodoSpecificEvent,
    setDisabledSortButtonsEvent,
    setInteractionElementsEvent
} from "../../Todo";
import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import { CustomTodoEvents } from "../../enums/CustomTodoEventsEnum";

const moveEvent = new CustomEvent(CustomTodoEvents.MOVE)

export const dispatchMoveTodoEvent = (event: Event | MouseEvent | CustomEvent) => {
    console.log("event.target", event.currentTarget)
    event.currentTarget?.dispatchEvent(moveEvent)
}

// todo currently does not work
export const handleMoveTodo = (event: Event) => {
    const todoItems: TodoItem[] = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    const todoList = componentRoot.querySelector('[data-todo="todoList"]') as HTMLDivElement
    let todoElementNodeList: NodeListOf<Element> = componentRoot.querySelectorAll('[data-todo="todoItem"]');
    console.log("moved single")
    moveTodoInDirection(event);
    renderAllTodos(todoItems, todoList);
    document.dispatchEvent(setInteractionElementsEvent)
    document.dispatchEvent(setDisabledSortButtonsEvent)
    setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));

    console.log("move", todoItems)

    // here all listeners for elements inside a todoElement have to be set again
    // because within the renderAllTodos function the innerHTML of the todolist ist emptied
    // which deletes all listeners as well
    document.dispatchEvent(bindEventsTodoSpecificEvent);

    setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
}

const moveTodoInDirection = (event: Event) => {
    let todoItems: TodoItem[] = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
    const moveButton = event.currentTarget as HTMLButtonElement;
    console.log("movetodoindirection")
    // todo find a way to find the index easier
    const buttonId = getElementId(moveButton);
    const todoItemToMove = getTodoItemById(todoItems, buttonId) as TodoItem;
    const indexOfTodoItemToMove = todoItems.indexOf(todoItemToMove);

    if (getSelectedDirection(moveButton, 'up'))
        todoItems = swapTodoIndexByDirection(todoItems, indexOfTodoItemToMove, 'up')
    else if (getSelectedDirection(moveButton, 'down'))
        todoItems = swapTodoIndexByDirection(todoItems, indexOfTodoItemToMove, 'down')

    setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
}