import { getElementId } from "../../utils/getElementId/getElementId";
import { getTodoItemById } from "../../utils/getTodoItemById/getTodoItemById";
import validateInput from "../../../../util/validateInput/validateInput";
import { getLocalStorage, setLocalStorage } from "../../../../util/localStorageUtility";
import setFontSizeForEachTodo from "../../utils/setFontSizeForEachTodo/setFontSizeForEachTodo";
import getDeviceOutput from "../../../../util/getDeviceOutput/getDeviceOutput";
import TodoItem from "../../interfaces/TodoItem";
import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import { dispatchSetInputState } from "../../events/CustomEvents";
import { removeEditInput } from "./removeEditInput/removeEditInput";
import { cancelEdit } from "./cancelEdit/cancelEdit";

let currentTodoId: string | null;
let modifiedTodoItems: TodoItem[] = [];
let indexOfEditableTodoItem: number;
let selectedEditableTodoItem: TodoItem | undefined;
let currentlyEditedTitle: Element;
let todoElementNodeList: NodeListOf<Element>;
const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;

// @CLEANUP clean up file
export const handleEditTodoLabel = (event: Event) => {
    const todoItems: TodoItem[] = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
    currentlyEditedTitle = event.currentTarget as Element;
    currentlyEditedTitle.classList.add('todo__title--edit');
    modifiedTodoItems = Array.from(todoItems)
    const editTodoInput = currentlyEditedTitle.querySelector('[data-todo="editTodoInput"]') as HTMLInputElement;
    const parent = currentlyEditedTitle?.parentElement?.parentElement;
    currentTodoId = parent ? getElementId(parent) : '';
    selectedEditableTodoItem = getTodoItemById(todoItems, currentTodoId);

    if (editTodoInput && selectedEditableTodoItem) {
        indexOfEditableTodoItem = todoItems.indexOf(selectedEditableTodoItem);
        editTodoInput.focus();
        editTodoInput.setSelectionRange(editTodoInput.value.length, editTodoInput.value.length);

        editTodoInput.addEventListener( 'input', dispatchSetInputState);
        editTodoInput.addEventListener('keydown', handleEditSubmit);
        editTodoInput.addEventListener('keyup', (event) => {
            if (event.key === "Enter")
                removeEditInput(editTodoInput, currentlyEditedTitle);
            if (event.key === "Escape")
                cancelEdit(editTodoInput, currentlyEditedTitle);
        });
        editTodoInput.addEventListener('blur', () => { cancelEdit(editTodoInput, currentlyEditedTitle); });
    }
}

export const handleEditSubmit = (event: Event | KeyboardEvent) => {
    let todoItems: TodoItem[] = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
    todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');
    const { key } = event as KeyboardEvent;
    const todoLabel = currentlyEditedTitle.querySelector('p');
    const editTodoInput = currentlyEditedTitle.querySelector('[data-todo="editTodoInput"]') as HTMLInputElement;
    const newTitle = editTodoInput.value;

    if (key === "Enter" && selectedEditableTodoItem && todoLabel && currentTodoId && validateInput(newTitle)) {
        modifiedTodoItems[indexOfEditableTodoItem] = {
            id: currentTodoId,
            title: newTitle,
            completed: selectedEditableTodoItem.completed
        };

        todoLabel.textContent = newTitle;
        todoItems = modifiedTodoItems;
        setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
        setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));
    }
}