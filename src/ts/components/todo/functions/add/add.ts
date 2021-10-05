import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import { 
    getLocalStorage, 
    setLocalStorage 
} from "../../../../util/localStorage/localStorageUtility";
import getUniqueId from "../../../../util/uniqueId/uniqueId";
import { 
    fireGlobalEvent, 
    setInteractionElementsEvent 
} from "../../events/CustomEvents";
import TodoItem from "../../interfaces/TodoItem";
import { setTodoInteractions } from "../../utils/setTodoInteractions/setTodoInteractions";
import addTodoElementToDom from "../../utils/todoDomElementGeneration/addElementToDom";
import { giveNewTodoEventListeners } from "./giveNewTodoEventListeners/giveNewTodoEventListeners";

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