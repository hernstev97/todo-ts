import {
    dispatchEditTodoEvent,
    dispatchMoveTodoEvent,
    dispatchRemoveSingleTodoEvent,
    dispatchTodoCompletionEvent
} from "../../events/CustomEvents";
import { assignBulkEventListeners } from "../../../../util/assignBulkEventListeners";
import { CustomTodoEvents } from "../../enums/CustomTodoEventsEnum";
import { remove } from "../../functions/remove/remove";
import { handleTodoCompletion } from "../../functions/complete/complete";
import { handleMoveTodo } from "../../functions/moving/moving";
import { handleEditTodoLabel } from "../../functions/edit/edit";
import { TodoEventTarget } from "../../interfaces/TodoEventTarget";

// @TEST figure out how a test would look
export const bindTodoSpecificEvents = (eventCarrier: TodoEventTarget) => {
    // delete
    assignBulkEventListeners(eventCarrier.deleteButtonList, 'click', dispatchRemoveSingleTodoEvent);
    assignBulkEventListeners(eventCarrier.deleteButtonList, CustomTodoEvents.REMOVE_SINGLE, remove().removeSingle);

    // complete
    assignBulkEventListeners(eventCarrier.doneCheckboxList, 'change', dispatchTodoCompletionEvent);
    assignBulkEventListeners(eventCarrier.doneCheckboxList, CustomTodoEvents.TOGGLE_COMPLETE, handleTodoCompletion);

    // move/sort
    assignBulkEventListeners(eventCarrier.moveInDirectionButtonList, 'click', dispatchMoveTodoEvent);
    assignBulkEventListeners(eventCarrier.moveInDirectionButtonList, CustomTodoEvents.MOVE, handleMoveTodo);

    // edit
    assignBulkEventListeners(eventCarrier.titleList, 'dblclick', dispatchEditTodoEvent);
    assignBulkEventListeners(eventCarrier.titleList, CustomTodoEvents.EDIT, handleEditTodoLabel);
}