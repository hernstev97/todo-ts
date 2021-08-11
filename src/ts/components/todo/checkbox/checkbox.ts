import { getLocalStorage, setLocalStorage } from "../../../util/localStorageUtility";
import { getTodoItemById } from "../utils/getTodoItemById";
import TodoItem from "../../../interfaces/TodoItem";

const completeEvent = new CustomEvent('toggleComplete')

export const handleTodoCompletion = (event: Event | MouseEvent | CustomEvent) => {
    if (!('detail' in event) || 'clientX' in event) return;

    const todoItems = getLocalStorage('todoItems');
    const id = getIdOfCurrentTarget(event);
    const currentTodo = getTodoItemById(todoItems, id);
    const parent = getParent(event);

    if (currentTodo === undefined) return;

    toggleTodoCompleteState(currentTodo, parent);

    setLocalStorage('todoItems', todoItems);
}

export const handleCheckboxChange = (event: Event | MouseEvent | CustomEvent) => {
    event.target?.dispatchEvent(completeEvent)
}

const getIdOfCurrentTarget = (event: CustomEvent) => {
    const element = event.currentTarget as HTMLElement;
    return element.dataset.id;
}

const getParent = (event: CustomEvent): HTMLElement => {
    return event.composedPath().find(element => (element as HTMLElement).classList.contains('todo')) as HTMLElement;
}

const toggleTodoCompleteState = (todo: TodoItem, parent: HTMLElement) => {
    todo.completed = !todo.completed;

    if (todo.completed)
        parent.classList.add('todo--completed');
    else
        parent.classList.remove('todo--completed');
}