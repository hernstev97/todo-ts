import { getLocalStorage, setLocalStorage } from "../../../../util/localStorageUtility";
import { getTodoItemById } from "../../utils/getTodoItemById/getTodoItemById";
import { getTodoFromEventPath } from "../../utils/getParentFromWithin/getTodoFromEventPath";
import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import { toggleTodoCompleteState } from "./toggleTodoCompleteState/toggleTodoCompleteState";
import { getIdOfCurrentTarget } from "./getIdOfCurrentTarget/getIdOfCurrentTarget";

export const handleTodoCompletion = (event: Event | MouseEvent | CustomEvent) => {
    if (!('detail' in event) || 'clientX' in event) return;

    const todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
    const id = getIdOfCurrentTarget(event);
    const currentTodo = getTodoItemById(todoItems, id);
    const parent = getTodoFromEventPath(event.composedPath());

    if (currentTodo === undefined) return;

    toggleTodoCompleteState(currentTodo, parent);

    setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
}