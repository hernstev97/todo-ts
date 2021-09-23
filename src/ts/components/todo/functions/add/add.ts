import validateInput from "../../../../util/validateInput/validateInput";
import allItemsRemoveButtonVisibilityHandler
    from "../../utils/allItemsRemoveButtonVisibilityHandler";
import {
    dispatchEditTodoEvent, dispatchMoveTodoEvent,
    dispatchRemoveSingleTodoEvent, dispatchSetInputState,
    dispatchTodoCompletionEvent,
    fireGlobalEvent,
    setDisabledSortButtonsEvent,
    setInteractionElementsEvent
} from "../../events/CustomEvents";
import { getLocalStorage, setLocalStorage } from "../../../../util/localStorageUtility";
import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import addTodoElementToDom from "../../utils/todoDomElementGeneration/addElementToDom";
import getUniqueId from "../../../../util/uniqueId/uniqueId";
import TodoItem from "../../interfaces/TodoItem";
import { CustomTodoEvents } from "../../enums/CustomTodoEventsEnum";
import { handleTodoCompletion } from "../complete/complete";
import { remove } from "../remove/remove";
import { handleEditTodoLabel } from "../edit/edit";
import { getElementId } from "../../utils/getElementId/getElementId";
import { handleMoveTodo } from "../moving/moving";
import { TodoEventTarget } from "../../interfaces/TodoEventTarget";
import { setTodoInteractions } from "../../utils/setTodoInteractions/setTodoInteractions";

let inputState = '';
let todoDoneCheckboxList: HTMLInputElement[];
let deleteSingleTodoButtonList: HTMLButtonElement[];
let moveTodoInDirectionButtonList: HTMLButtonElement[];
let todoTitleList: HTMLDivElement[];
let uniqueIdForThisTodo = '';
const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
const addTodoTextInput = componentRoot.querySelector('[data-todo="addTodoTextInput"]') as HTMLInputElement;

export const handleFormSubmit = () => {
    if (validateInput(inputState)) {
        const todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
        const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
        const removeAllItemsButton = componentRoot.querySelector('[data-todo="removeAllItemsButton"]') as HTMLButtonElement;

        addTodoItem();
        createNewTodoDOMElement();
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
        fireGlobalEvent(setDisabledSortButtonsEvent);
    }
}

const createNewTodoDOMElement = () => {
    const todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS)
    const indexForNewItem = todoItems.length - 1
    const newTodo = todoItems[indexForNewItem];

    addTodoElementToDom({
        id: uniqueIdForThisTodo,
        title: newTodo.title,
        completed: newTodo.completed,
    });

    const targets = setTodoInteractions(componentRoot);

    fireGlobalEvent(setInteractionElementsEvent)
    giveNewTodoEventListeners(
        newTodo,
        indexForNewItem,
        {
            doneCheckboxList: targets.doneCheckboxList,
            deleteButtonList: targets.deleteButtonList,
            moveInDirectionButtonList: targets.moveInDirectionButtonList,
            titleList: targets.titleList,
        }
    );
}

const addTodoItem = () => {
    const todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS)

    if (addTodoTextInput.value.length === 0) return;
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

const giveNewTodoEventListeners = (newTodo: TodoItem, index: number, targets: TodoEventTarget) => {
    targets.doneCheckboxList[index].addEventListener('change', dispatchTodoCompletionEvent);
    targets.doneCheckboxList[index].addEventListener(CustomTodoEvents.TOGGLE_COMPLETE, handleTodoCompletion);

    targets.deleteButtonList[index].addEventListener('click', dispatchRemoveSingleTodoEvent)
    targets.deleteButtonList[index].addEventListener(CustomTodoEvents.REMOVE_SINGLE, remove().removeSingle)

    targets.titleList[index].addEventListener('dblclick', dispatchEditTodoEvent);
    targets.titleList[index].addEventListener(CustomTodoEvents.EDIT, handleEditTodoLabel);

    targets.moveInDirectionButtonList.forEach(button => {
        if (getElementId(button) === newTodo.id) {
            button.addEventListener('click', dispatchMoveTodoEvent);
            button.addEventListener(CustomTodoEvents.MOVE, handleMoveTodo);
        }
    })
}

const setInputState = (event: Event) => {
    const input = event?.target as HTMLInputElement;
    inputState = input.value ?? '';
}

addTodoTextInput.addEventListener( 'input', dispatchSetInputState);
addTodoTextInput.addEventListener(CustomTodoEvents.SET_INPUT_STATE, setInputState)