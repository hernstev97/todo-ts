import insertAfter from "./insertAfter";

export default function addTodoElementToDom (id: number, todoTitle: string) {
    const todoItem = document.createElement("div");
    todoItem.classList.add('todo');
    todoItem.setAttribute('id', `todo${id}`)

    const title = document.createElement('div');
    title.classList.add('todo__item-title');

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');

    const titleEditable = document.createElement('div');
    titleEditable.classList.add('todo__item-title-editable');

    const label = document.createElement('p');
    label.classList.add('todo__item-label');
    const labelContent = document.createTextNode(todoTitle);
    label.appendChild(labelContent)

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('todo__item-delete');
    const buttonContent = document.createTextNode("Delete");
    deleteButton.appendChild(buttonContent)

    title.appendChild(checkbox);
    titleEditable.appendChild(label)
    title.appendChild(titleEditable);
    title.appendChild(deleteButton);

    // title
        // checkbox
        // title-editable
            // title-label
    // button delete-todo
        // svg/png

    const form = document.querySelector('.todo__input') as HTMLFormElement;

    todoItem.appendChild(title);
    insertAfter(todoItem, form)
}