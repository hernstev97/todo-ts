import TodoItem from "../../interfaces/TodoItem";
import setFontSizeForEachTodo from "../../utils/setFontSizeForEachTodo/setFontSizeForEachTodo";
import getDeviceOutput from "../../../../util/getDeviceOutput/getDeviceOutput";
import { renderAllTodos } from "../../utils/renderAllTodos/renderAllTodos";
import { getLocalStorage, setLocalStorage } from "../../../../util/localStorage/localStorageUtility";
import { getElementId } from "../../utils/getElementId/getElementId";
import { getTodoItemById } from "../../utils/getTodoItemById/getTodoItemById";
import { getSelectedDirection } from "../../utils/getSelectedDirection/getSelectedDirection";
import { swapTodoIndexByDirection } from "../../utils/swapTodoIndexByDirection/swapTodoIndexByDirection";
import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import {
    bindEventsTodoSpecificEvent,
    fireGlobalEvent,
    setDisabledSortButtonsEvent,
    setInteractionElementsEvent
} from "../../events/CustomEvents";

export const handleMoveTodo = (event: Event) => {
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    const todoList = componentRoot.querySelector('[data-todo="todoList"]') as HTMLDivElement;
    let todoElementNodeList: NodeListOf<Element> = componentRoot.querySelectorAll('[data-todo="todoItem"]');

    moveTodoInDirection(event);
    renderAllTodos(getLocalStorage(LocalStorageKeys.TODO_ITEMS), todoList);

    fireGlobalEvent(setInteractionElementsEvent)
    fireGlobalEvent(setDisabledSortButtonsEvent)

    setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));

    // here all listeners for elements inside a todoElement have to be set again
    // because within the renderAllTodos function the innerHTML of the todolist ist emptied
    // which deletes all listeners as well
    fireGlobalEvent(bindEventsTodoSpecificEvent);
}

const moveTodoInDirection = (event: Event) => {
    let todoItems: TodoItem[] = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
    const moveButton = event.currentTarget as HTMLButtonElement;
    const indexOfTodoItemToMove = indexOfItemToMoveByButton(moveButton, todoItems);

    if (getSelectedDirection(moveButton, 'up'))
        todoItems = swapTodoIndexByDirection(todoItems, indexOfTodoItemToMove, 'up')
    else if (getSelectedDirection(moveButton, 'down'))
        todoItems = swapTodoIndexByDirection(todoItems, indexOfTodoItemToMove, 'down')

    setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
}

const indexOfItemToMoveByButton = (moveButton: Element, todoItems: TodoItem[]): number => {
    const buttonId = getElementId(moveButton);
    const todoItemToMove = getTodoItemById(todoItems, buttonId) as TodoItem;

    return todoItems.indexOf(todoItemToMove);
}