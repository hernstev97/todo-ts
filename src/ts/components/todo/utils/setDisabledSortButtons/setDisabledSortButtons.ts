import { removeDisabledAttribute, setDisabledAttribute } from "../../../../util/disabledAttributeUtility";
import { getLocalStorage } from "../../../../util/localStorageUtility";
import {LocalStorageKeys} from "../../../../enums/LocalStorageKeysEnum";


export const setDisabledSortButtons = () => {
    const todoItems = getLocalStorage(LocalStorageKeys.TODO_ITEMS);
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    const todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');
    if (todoItems && todoItems.length > 0) {
        const firstTodo = todoElementNodeList[0];
        const lastTodo = todoElementNodeList[todoElementNodeList.length - 1];
        todoElementNodeList.forEach(todo => {
            removeDisabledAttribute(todo, '[data-moveTodoInDirection="up"]')
            removeDisabledAttribute(todo, '[data-moveTodoInDirection="down"]')
        })
        setDisabledAttribute(firstTodo, '[data-moveTodoInDirection="up"]')
        setDisabledAttribute(lastTodo, '[data-moveTodoInDirection="down"]')
    }
}