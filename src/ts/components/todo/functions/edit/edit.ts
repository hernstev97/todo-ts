import { LocalStorageKeys } from "../../../../enums/LocalStorageKeysEnum";
import getDeviceOutput from "../../../../util/getDeviceOutput/getDeviceOutput";
import { setLocalStorage } from "../../../../util/localStorage/localStorageUtility";
import TodoItem from "../../interfaces/TodoItem";
import { getTodoItemById } from "../../utils/getTodoItemById/getTodoItemById";
import setFontSizeForEachTodo from "../../utils/setFontSizeForEachTodo/setFontSizeForEachTodo";

export const editTodoItem = (todoItems: TodoItem[], idOfEditableTodo: string, titleState: string = '', descriptionState?: string) => {
    const todoElementNodeList = document.querySelectorAll('[data-todo="todoItem"]') as NodeListOf<Element>;
    const todoElement = Array.from(todoElementNodeList).find(element => element.getAttribute('data-id') === idOfEditableTodo);
    const todoItem = getTodoItemById(todoItems, idOfEditableTodo);
    const todoTitle = todoElement?.querySelector('.todo__label') as HTMLInputElement;
    const todoDescription = todoElement?.querySelector('.todo__description') as HTMLTextAreaElement;
    const modifiedTodoItems = Array.from(todoItems);
    let indexOfEditableTodoItem: number;

    if (todoItem) {
        indexOfEditableTodoItem = todoItems.indexOf(todoItem);
        modifiedTodoItems[indexOfEditableTodoItem] = {
            id: idOfEditableTodo,
            title: titleState,
            description: descriptionState,
            completed: todoItem.completed
        }

        todoItems = modifiedTodoItems;
    }

    todoTitle.textContent = titleState;
    todoDescription.textContent = descriptionState ?? '';
    setLocalStorage(LocalStorageKeys.TODO_ITEMS, todoItems);
    setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));
};