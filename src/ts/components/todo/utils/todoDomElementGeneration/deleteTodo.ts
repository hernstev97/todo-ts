export default function deleteTodo(id: string){
    return `<button data-todo="deleteSingleTodoButton" class="todo__interaction--delete todo__interaction" data-id="${id}">Entfernen</button>`;
}