import { CustomTodoEvents } from "../../../enums/CustomTodoEventsEnum";
import { dispatchEditTodoEvent, dispatchMoveTodoEvent, dispatchRemoveSingleTodoEvent, dispatchTodoCompletionEvent } from "../../../events/CustomEvents";
import { TodoEventTarget } from "../../../interfaces/TodoEventTarget";
import TodoItem from "../../../interfaces/TodoItem";
import { getElementId } from "../../../utils/getElementId/getElementId";
import { handleTodoCompletion } from "../../complete/complete";
import { todoModal } from "../../modal/todoModal";
import { handleMoveTodo } from "../../moving/moving";
import { remove } from "../../remove/remove";

export const giveNewTodoEventListeners = (newTodo: TodoItem, index: number, targets: TodoEventTarget) => {
    targets.doneCheckboxList[index].addEventListener('change', dispatchTodoCompletionEvent);
    targets.doneCheckboxList[index].addEventListener(CustomTodoEvents.TOGGLE_COMPLETE, handleTodoCompletion);

    targets.deleteButtonList[index].addEventListener('click', dispatchRemoveSingleTodoEvent)
    targets.deleteButtonList[index].addEventListener(CustomTodoEvents.REMOVE_SINGLE, remove().removeSingle)

    targets.editButtonList[index].addEventListener('click', dispatchEditTodoEvent)
    targets.editButtonList[index].addEventListener(CustomTodoEvents.EDIT, todoModal().open)

    targets.moveInDirectionButtonList.forEach(button => {
        if (getElementId(button) === newTodo.id) {
            button.addEventListener('click', dispatchMoveTodoEvent);
            button.addEventListener(CustomTodoEvents.MOVE, handleMoveTodo);
        }
    })
}