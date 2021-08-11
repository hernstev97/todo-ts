export default function todoTitle(title: string) {
    return `
        <div class="todo__title" data-todo="todoTitle">
            <p class="todo__label">${title}</p>
            <input data-todo="editTodoInput" class="todo__edit" type="text" value="${title}" />
        </div>`
}