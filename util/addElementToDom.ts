export default function addTodoElementToDom (id: number, todoTitle: string, completed: boolean) {
    const todoItem = document.createElement("div");
    todoItem.classList.add('todo');
    if (completed)
        todoItem.classList.add('todo--completed');
    todoItem.setAttribute('data-id', `${id}`);

    const title = document.createElement('div');
    title.classList.add('todo__flex-container');

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('data-id', `${id}`);
    if (completed)
        checkbox.setAttribute('checked', '');

    // @todo later change to todo__title--edit when being edited
    const titleEditable = document.createElement('div');
    titleEditable.classList.add('todo__title');

    const label = document.createElement('p');
    label.classList.add('todo__label');
    const labelContent = document.createTextNode(todoTitle);
    label.appendChild(labelContent)

    const moveDeleteWrapper = document.createElement('div')
    moveDeleteWrapper.classList.add('todo__move-delete-wrapper');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('todo__item-delete');
    deleteButton.setAttribute('data-id', `${id}`);

    const moveUpButtonContainer = document.createElement('button');
    moveUpButtonContainer.classList.add('todo__move');
    moveUpButtonContainer.classList.add('todo__move--up');
    const moveUpButton = document.createElement('div');
    moveUpButtonContainer.appendChild(moveUpButton)

    const moveDownButtonContainer = document.createElement('button');
    moveDownButtonContainer.classList.add('todo__move');
    moveDownButtonContainer.classList.add('todo__move--down');
    const moveDownButton = document.createElement('div');
    moveDownButtonContainer.appendChild(moveDownButton)

    title.appendChild(checkbox);
    titleEditable.appendChild(label)
    title.appendChild(titleEditable);
    title.appendChild(moveDeleteWrapper);
    moveDeleteWrapper.appendChild(moveUpButtonContainer)
    moveDeleteWrapper.appendChild(deleteButton)
    moveDeleteWrapper.appendChild(moveDownButtonContainer)

    const todoList = document.querySelector('.todo-list') as HTMLDivElement;

    todoItem.appendChild(title);
    todoList.appendChild(todoItem);
}