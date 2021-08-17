import {getLocalStorage, setLocalStorage} from "../../../../util/localStorageUtility";
import allItemsRemoveButtonVisibilityHandler from "../../utils/allItemsRemoveButtonVisibilityHandler";
import TodoItem from "../../interfaces/TodoItem";
import {getElementId} from "../../utils/getElementId/getElementId";
import {getTodoFromEventPath} from "../../utils/getParentFromWithin/getTodoFromEventPath";
import {getTodoItemById} from "../../utils/getTodoItemById";
import {setDisabledSortButtonsEvent} from "../../Todo";
import {LocalStorageKeys} from "../../../../enums/LocalStorageKeysEnum";
import {CustomTodoEvents} from "../../enums/CustomTodoEventsEnum";

const removeSingleEvent = new CustomEvent(CustomTodoEvents.REMOVE_SINGLE)
const removeAllEvent = new CustomEvent(CustomTodoEvents.REMOVE_ALL)

export const dispatchRemoveSingleTodoEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.currentTarget?.dispatchEvent(removeSingleEvent)
}

export const dispatchRemoveAllTodoEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.currentTarget?.dispatchEvent(removeAllEvent)
}

export const remove = () => {
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    const removeAllItemsButton = componentRoot.querySelector('[data-todo="removeAllItemsButton"]') as HTMLButtonElement;
    let todoElementNodeList: NodeListOf<Element>;
    const removeCleanUpEvent = new CustomEvent(CustomTodoEvents.REMOVE_CLEANUP)
    let todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);

    const removeSingle = (event: Event) => {
        removeSingleTodo(event);
        document.dispatchEvent(setDisabledSortButtonsEvent)
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    }

    const removeSingleTodo = (event: Event) => {
        todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
        if (!('detail' in event) || 'clientX' in event) return;

        const deletable = event.target as Element;
        const removeId = getElementId(deletable);
        const parent = getTodoFromEventPath(event.composedPath());
        const toRemoveTodo = getTodoItemById(todoItems, removeId);
        const toRemoveTodoIndex = toRemoveTodo ? todoItems.indexOf(toRemoveTodo) : -1;

        for (let todoIndex = 0; todoIndex < todoItems.length; todoIndex++) {
            if (todoIndex === toRemoveTodoIndex)
                todoItems.splice(todoIndex, 1);
        }

        if (parent) parent.remove();

        setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
        document.dispatchEvent(removeCleanUpEvent)
    }

    const removeAll = (event: Event) => {
        removeAllTodos(event)
        allItemsRemoveButtonVisibilityHandler([], removeAllItemsButton);
    }

    // todo test this
    const removeAllTodos = (event: Event) => {
        event.preventDefault();

        setLocalStorage(LocalStorageKeys.TODO_ITEMS, [])
        todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');
        todoElementNodeList.forEach(todo => todo.remove());
        document.dispatchEvent(removeCleanUpEvent)
    }

    return {
        removeAll,
        removeSingle
    }
}