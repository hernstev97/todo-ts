import { getLocalStorage, setLocalStorage } from "../../../../util/localStorageUtility";
import { getTodoItemById } from "../../utils/getTodoItemById";
import TodoItem from "../../interfaces/TodoItem";
import { getTodoFromEventPath } from "../../utils/getParentFromWithin/getTodoFromEventPath";
import {LocalStorageKeys} from "../../../../enums/LocalStorageKeysEnum";
import {CustomTodoEvents} from "../../enums/CustomTodoEventsEnum";

const completeEvent = new CustomEvent(CustomTodoEvents.TOGGLE_COMPLETE)

export const dispatchTodoCompletionEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.currentTarget?.dispatchEvent(completeEvent)
}

// todo reload is neccessary for event to work
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

// todo rename
const getIdOfCurrentTarget = (event: CustomEvent) => {
    const element = event.currentTarget as HTMLElement;
    return element.dataset.id;
}

const toggleTodoCompleteState = (todo: TodoItem, parent: HTMLElement) => {
    todo.completed = !todo.completed;

    if (todo.completed)
        parent.classList.add('todo--completed');
    else
        parent.classList.remove('todo--completed');
}