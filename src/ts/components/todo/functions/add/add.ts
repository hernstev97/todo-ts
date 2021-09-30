import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import { 
    getLocalStorage, 
    setLocalStorage 
} from "../../../../util/localStorage/localStorageUtility";
import getUniqueId from "../../../../util/uniqueId/uniqueId";
import validateInput from "../../../../util/validateInput/validateInput";
import { CustomTodoEvents } from "../../enums/CustomTodoEventsEnum";
import { 
    dispatchMoveTodoEvent, 
    dispatchRemoveSingleTodoEvent, 
    dispatchTodoCompletionEvent, 
    fireGlobalEvent, 
    setInteractionElementsEvent 
} from "../../events/CustomEvents";
import { TodoEventTarget } from "../../interfaces/TodoEventTarget";
import TodoItem from "../../interfaces/TodoItem";
import { getElementId } from "../../utils/getElementId/getElementId";
import { setTodoInteractions } from "../../utils/setTodoInteractions/setTodoInteractions";
import addTodoElementToDom from "../../utils/todoDomElementGeneration/addElementToDom";
import { handleTodoCompletion } from "../complete/complete";
import { handleMoveTodo } from "../moving/moving";
import { remove } from "../remove/remove";

let componentRoot: HTMLElement;
let todoItems: TodoItem[];
let uniqueIdForThisTodo = '';

export const createNewTodoDOMElement = () => {
    componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS) ?? [];
    const indexForNewItem = todoItems.length - 1
    const newTodo = todoItems[indexForNewItem];

    addTodoElementToDom({
        id: uniqueIdForThisTodo,
        title: newTodo.title,
        description: newTodo.description,
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
            editButtonList: targets.editButtonList,
            moveInDirectionButtonList: targets.moveInDirectionButtonList,
            titleList: targets.titleList,
        }
    );
}

export const addTodoItem = (title: string, description?: string) => {
    todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS) ?? [];

    if (title.length === 0) return;
    uniqueIdForThisTodo = getUniqueId();

    const todoItem: TodoItem = {
        id: uniqueIdForThisTodo,
        title: title,
        description: description,
        completed: false,
    }

    todoItems.push(todoItem);
    setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
}

export const validateTodoContent = (title: string, description?: string) => {
    if (description)
        return validateInput(title) && validateInput(description)

    return validateInput(title);
}

const giveNewTodoEventListeners = (newTodo: TodoItem, index: number, targets: TodoEventTarget) => {
    targets.doneCheckboxList[index].addEventListener('change', dispatchTodoCompletionEvent);
    targets.doneCheckboxList[index].addEventListener(CustomTodoEvents.TOGGLE_COMPLETE, handleTodoCompletion);

    targets.deleteButtonList[index].addEventListener('click', dispatchRemoveSingleTodoEvent)
    targets.deleteButtonList[index].addEventListener(CustomTodoEvents.REMOVE_SINGLE, remove().removeSingle)

    targets.moveInDirectionButtonList.forEach(button => {
        if (getElementId(button) === newTodo.id) {
            button.addEventListener('click', dispatchMoveTodoEvent);
            button.addEventListener(CustomTodoEvents.MOVE, handleMoveTodo);
        }
    })
}