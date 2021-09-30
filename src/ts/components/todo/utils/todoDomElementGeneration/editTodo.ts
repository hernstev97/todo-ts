export default function editTodo(id: string): string {
    return `<button data-todo="editTodoButton" data-modal="edit" class="todo__interaction todo__interaction--edit" data-id="${id}">Bearbeiten</button>`;
}