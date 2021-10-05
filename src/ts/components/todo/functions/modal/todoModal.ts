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
    createNewTodoDOMElement
} from "../add/add";
import { editTodoItem } from "../edit/edit"
import { modal } from './modal';
import { validateTodoContent } from "./validateTodoContent/validateTodoContent";

export const todoModal = () => {
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    const todoTitleInput = componentRoot.querySelector('[data-todo="todoTitleInput"]') as HTMLInputElement;
    const todoDescriptionInput = componentRoot.querySelector('[data-todo="todoDescriptionInput"]') as HTMLTextAreaElement;
    const errorMessageElement = componentRoot.querySelector('.error-message') as HTMLParagraphElement;
    const errorMessage = 'Bitte füllen Sie mindestens das Feld für den Titel aus.';
    const commitButton = componentRoot.querySelector('[data-todo="commitTodoButton"]') as HTMLButtonElement;
    type EditingMode = 'add' | 'edit';
    let mode: EditingMode;
    let idOfEditableTodo: string;
    let editableTodoItem: TodoItem | undefined;
    let todoItems: TodoItem[];
    let titleState = '';
    let descriptionState = '';

    const open = (event: Event) => {
        const targetElement = event.target as HTMLButtonElement;
        mode = targetElement.getAttribute('data-modal') as EditingMode;
        const usageTitle = mode === 'add' ? 'Neues Todo' : 'Todo bearbeiten';
        todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
        commitButton.setAttribute('data-modal', mode)

        todoTitleInput.value = '';
        todoDescriptionInput.value = '';
        errorMessageElement.textContent = '';
        
        modal().open(usageTitle);

        if (mode === 'edit') {
            idOfEditableTodo = targetElement.getAttribute('data-id') as string;
            editableTodoItem = getTodoItemById(todoItems, idOfEditableTodo);

            if (editableTodoItem) {
                todoTitleInput.value = editableTodoItem.title;
                todoDescriptionInput.value = editableTodoItem.description ?? '';
            }
        }

        commitButton.addEventListener('click', commitTodo)
    }

    const commitTodo = (event: Event) => {
        const targetElement = event.target as HTMLButtonElement;
        mode = targetElement.getAttribute('data-modal') as EditingMode;
        titleState = todoTitleInput.value;
        descriptionState = todoDescriptionInput.value;

        if (validateTodoContent(titleState, descriptionState)) {
            commitValidTodoContent(mode);
            cleanUpModalContent(mode);
        } else {   
            errorMessageElement.textContent = errorMessage;
        }
    }

    const commitValidTodoContent = (mode: EditingMode) => {
        if (mode === 'edit') {
            editTodoItem(todoItems, idOfEditableTodo, titleState, descriptionState);
        }

        if (mode === "add") {
            addTodoItem(titleState, descriptionState);
            createNewTodoDOMElement();
            todoTitleInput.value = '';
        }
    }

    const cleanUpModalContent = (mode: EditingMode) => {
        todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS) ?? [];
        const removeAllItemsButton = componentRoot.querySelector('[data-todo="removeAllItemsButton"]') as HTMLButtonElement;

        if (mode === "add")
            todoTitleInput.value = '';

        titleState = '';
        descriptionState = '';
        commitButton.removeEventListener('click', commitTodo);
        modal().close();
        allItemsRemoveButtonVisibilityHandler(removeAllItemsButton);
        fireGlobalEvent(setDisabledSortButtonsEvent);
    }

    return { open };
}