import { LocalStorageKeys } from "../../../enums/LocalStorageKeysEnum";
import { getLocalStorage } from "../../../util/localStorage/localStorageUtility";
import TodoItem from "../interfaces/TodoItem";

export default function allItemsRemoveButtonVisibilityHandler(button: HTMLButtonElement) {
    const todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS)

    if (todoItems !== undefined && todoItems.length === 0)
        button.classList.add('remove-all-items--hidden');
    else
        button.classList.remove('remove-all-items--hidden');
}