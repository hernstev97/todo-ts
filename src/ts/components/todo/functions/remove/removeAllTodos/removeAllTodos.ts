import { setLocalStorage } from "../../../../../util/localStorageUtility";
import { LocalStorageKeys } from "../../../../../enums/LocalStorageKeysEnum";
import { fireGlobalEvent, removeCleanUpEvent} from "../../../events/CustomEvents";

export const removeAllTodos = (event: Event, allTodoElements: NodeListOf<Element>) => {
    event.preventDefault();

    setLocalStorage(LocalStorageKeys.TODO_ITEMS, []);
    allTodoElements.forEach(todo => todo.remove());
    fireGlobalEvent(removeCleanUpEvent)
}