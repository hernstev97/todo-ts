import {TodoEventTarget} from "../../interfaces/TodoEventTarget";

export const setTodoInteractions = (componentRoot: HTMLElement): TodoEventTarget => {
    return {
        doneCheckboxList: Array.from(componentRoot.querySelectorAll('[data-todo="todoCompletedCheckbox"]')) as HTMLInputElement[],
        deleteButtonList: Array.from(componentRoot.querySelectorAll('[data-todo="deleteSingleTodoButton"]')) as HTMLButtonElement[],
        moveInDirectionButtonList: Array.from(componentRoot.querySelectorAll('[data-moveTodoInDirection]')) as HTMLButtonElement[],
        titleList: Array.from(componentRoot.querySelectorAll('[data-todo="todoTitle"]')) as HTMLDivElement[],
    };
}