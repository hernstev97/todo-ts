import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import { getLocalStorage, } from "../../../../util/localStorage/localStorageUtility";
import { 
    fireGlobalEvent, 
    setDisabledSortButtonsEvent, 
} from "../../events/CustomEvents";
import TodoItem from "../../interfaces/TodoItem";
import allItemsRemoveButtonVisibilityHandler from "../../utils/allItemsRemoveButtonVisibilityHandler";
import { getTodoItemById } from "../../utils/getTodoItemById/getTodoItemById";
import { 
    addTodoItem,
    createNewTodoDOMElement, 
    validateTodoContent 
} from "../add/add";
import { editTodoItem } from "../edit/edit"

// @TODO lock scrolling while modal is open
type EditingMode = 'add' | 'edit';
let mode: EditingMode;
let idOfEditableTodo: string;
let editableTodoItem: TodoItem | undefined;
let isModalOpen = false;
let closeButton: HTMLButtonElement;
let commitButton: HTMLButtonElement;
let componentRoot: HTMLElement;
let todoItems: TodoItem[];
let titleState = '';
let descriptionState = '';
let todoTitleInput: HTMLInputElement;
let modalWrapper: HTMLElement;

export const openModal = (event: Event) => {
    const targetElement = event.target as HTMLButtonElement;
    mode = targetElement.getAttribute('data-modal') as EditingMode;
    componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    modalWrapper = componentRoot.querySelector('[data-todo="modalWrapper"]') as HTMLElement;
    todoTitleInput = componentRoot.querySelector('[data-todo="todoTitleInput"]') as HTMLInputElement;
    const todoDescriptionInput = componentRoot.querySelector('[data-todo="todoDescriptionInput"]') as HTMLTextAreaElement;

    if (!isModalOpen) {
        todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
        isModalOpen = true;
        modalWrapper.classList.remove('modal-hidden');

        if (mode === 'edit') {
            todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
            idOfEditableTodo = targetElement.getAttribute('data-id') as string;
            editableTodoItem = getTodoItemById(todoItems, idOfEditableTodo);

            if (editableTodoItem) {
                console.log(todoTitleInput)
                todoTitleInput.value = editableTodoItem.title;
                todoDescriptionInput.value = editableTodoItem.description ?? '';
            }
        }

        closeButton = componentRoot.querySelector('[data-todo="closeModalButton"]') as HTMLButtonElement;
        commitButton = componentRoot.querySelector('[data-todo="commitTodoButton"]') as HTMLButtonElement;

        closeButton.addEventListener('click', closeModal)
        commitButton.addEventListener('click', commitTodo)
    }
}

export const closeModal = () => {
    componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    if (isModalOpen) {
        isModalOpen = false;
        modalWrapper.classList.add('modal-hidden');
        closeButton.removeEventListener('click', closeModal)
    }
}

export const commitTodo = () => {
    componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    todoTitleInput = componentRoot.querySelector('[data-todo="todoTitleInput"]') as HTMLInputElement;
    const todoDescriptionInput = componentRoot.querySelector('[data-todo="todoDescriptionInput"]') as HTMLTextAreaElement;
    titleState = todoTitleInput.value;
    descriptionState = todoDescriptionInput.value;

    if (mode === 'edit') {
        if (validateTodoContent(titleState, descriptionState)) {
            todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS) ?? [];
            const removeAllItemsButton = componentRoot.querySelector('[data-todo="removeAllItemsButton"]') as HTMLButtonElement;

            editTodoItem(todoItems, idOfEditableTodo, titleState, descriptionState);
            todoTitleInput.value = '';
            titleState = '';
            descriptionState = '';
            closeModal();
            allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
            fireGlobalEvent(setDisabledSortButtonsEvent);
        }
    }

    if (mode === 'add') {
        if (validateTodoContent(titleState, descriptionState)) {
            todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS) ?? [];
            const removeAllItemsButton = componentRoot.querySelector('[data-todo="removeAllItemsButton"]') as HTMLButtonElement;

            addTodoItem(titleState, descriptionState);
            todoTitleInput.value = '';
            titleState = '';
            descriptionState = '';
            createNewTodoDOMElement();
            closeModal();
            allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
            fireGlobalEvent(setDisabledSortButtonsEvent);
        }
    }
}