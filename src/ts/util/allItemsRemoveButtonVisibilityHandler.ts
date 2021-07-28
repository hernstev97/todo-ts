import TodoItem from "../interfaces/TodoItem";

export default function allItemsRemoveButtonVisibilityHandler(todoItems: TodoItem[], button: HTMLButtonElement) {
    if (todoItems !== undefined && todoItems.length === 0) {
        button.classList.add('remove-all-items--hidden');
    } else {
        button.classList.remove('remove-all-items--hidden');
    }
}