import TodoItem from "../interfaces/TodoItem";

export function setTodoItemInLocalStorage(todos: TodoItem[]) {
    window.localStorage.setItem('todoItems', JSON.stringify(todos));
}

export function getTodoItemsInLocalStorage(todos: TodoItem[], callbackFunction: (todos: TodoItem[]) => void) {
    const getLocalStorage = window.localStorage.getItem('todoItems');
    if (getLocalStorage !== null && getLocalStorage !== 'undefined') {
        todos = JSON.parse(getLocalStorage);
        callbackFunction(todos);
    }
}