export default function deleteTodo(id: string){
    return `<button data-todo="deleteSingleTodoButton" class="todo__item-delete" data-id="${id}"></button>`;
}