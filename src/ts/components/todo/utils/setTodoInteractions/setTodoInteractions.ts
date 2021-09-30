import {TodoEventTarget} from "../../interfaces/TodoEventTarget";

export const setTodoInteractions = (componentRoot: HTMLElement): TodoEventTarget => {
    return {
        doneCheckboxList: Array.from(componentRoot.querySelectorAll('[data-todo="todoCompletedCheckbox"]')) as HTMLInputElement[],
        editButtonList: Array.from(componentRoot.querySelectorAll('[data-todo="editTodoButton"]')) as HTMLButtonElement[],
        deleteButtonList: Array.from(componentRoot.querySelectorAll('[data-todo="deleteSingleTodoButton"]')) as HTMLButtonElement[],
        moveInDirectionButtonList: Array.from(componentRoot.querySelectorAll('[data-moveTodoInDirection]')) as HTMLButtonElement[],
        titleList: Array.from(componentRoot.querySelectorAll('[data-todo="todoTitle"]')) as HTMLDivElement[],
    };
}