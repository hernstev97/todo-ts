import TodoItem from "../../../interfaces/TodoItem";

export const toggleTodoCompleteState = (todo: TodoItem, parent: HTMLElement) => {
    todo.completed = !todo.completed;

    if (todo.completed)
        parent.classList.add('todo--completed');
    else
        parent.classList.remove('todo--completed');
}