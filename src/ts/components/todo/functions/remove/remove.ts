import { getLocalStorage } from "../../../../util/localStorageUtility";
import allItemsRemoveButtonVisibilityHandler from "../../utils/allItemsRemoveButtonVisibilityHandler";
import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import { fireGlobalEvent, setDisabledSortButtonsEvent } from "../../events/CustomEvents";
import { removeAllTodos } from "./removeAllTodos/removeAllTodos";
import { removeSingleTodo } from "./removeSingleTodo/removeSingleTodo";

export const remove = () => {
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    const removeAllItemsButton = componentRoot.querySelector('[data-todo="removeAllItemsButton"]') as HTMLButtonElement;
    let todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);

    const removeSingle = (event: Event) => {
        removeSingleTodo(event.target, event.composedPath());
        fireGlobalEvent(setDisabledSortButtonsEvent)
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    }

    const removeAll = (event: Event) => {
        let todoElementNodeList: NodeListOf<Element> = componentRoot.querySelectorAll('[data-todo="todoItem"]');
        removeAllTodos(event, todoElementNodeList)
        allItemsRemoveButtonVisibilityHandler([], removeAllItemsButton);
    }

    return {
        removeAll,
        removeSingle
    }
}