export default function checkbox(id: string, completed: boolean) {
    return `<input data-todo="todoCompletedCheckbox" type="checkbox" data-id="${id}" ${completed ? 'checked' : ''}>`
}