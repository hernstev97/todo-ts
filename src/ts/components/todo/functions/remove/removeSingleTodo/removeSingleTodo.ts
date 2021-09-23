import { getLocalStorage, setLocalStorage } from "../../../../../util/localStorageUtility";
import { LocalStorageKeys } from "../../../../../enums/LocalStorageKeysEnum";
import { getElementId } from "../../../utils/getElementId/getElementId";
import { getTodoFromEventPath } from "../../../utils/getParentFromWithin/getTodoFromEventPath";
import { getTodoItemById } from "../../../utils/getTodoItemById/getTodoItemById";
import { fireGlobalEvent, removeCleanUpEvent } from "../../../events/CustomEvents";

export const removeSingleTodo = (target: EventTarget | null, path: EventTarget[]) => {
    const todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
    console.log('target', target)
    const deletable = target as Element;
    const removeId = getElementId(deletable);
    const parent = getTodoFromEventPath(path);
    const toRemoveTodo = getTodoItemById(todoItems, removeId);
    const toRemoveTodoIndex = toRemoveTodo ? todoItems.indexOf(toRemoveTodo) : -1;

    for (let todoIndex = 0; todoIndex < todoItems.length; todoIndex++) {
        if (todoIndex === toRemoveTodoIndex)
            todoItems.splice(todoIndex, 1);
    }

    console.log('event.composedPath()', path);
    console.log("parent -> ", parent)

    if (parent) parent.remove();

    setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
    fireGlobalEvent(removeCleanUpEvent)
}