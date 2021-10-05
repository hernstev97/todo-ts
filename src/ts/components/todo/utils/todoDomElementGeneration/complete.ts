export default function complete(id: string, completed: boolean) {
    return `<input class="todo__interaction todo__interaction--done" data-todo="todoCompletedCheckbox" type="checkbox" data-id="${id}" ${completed ? 'checked' : ''}>`
}