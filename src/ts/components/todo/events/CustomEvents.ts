import { CustomTodoEvents } from "../enums/CustomTodoEventsEnum";

export const setInteractionElementsEvent = new CustomEvent(CustomTodoEvents.SET_INTERACTION_ELEMENTS)
export const setDisabledSortButtonsEvent = new CustomEvent(CustomTodoEvents.SET_DISABLED_SORT_BUTTONS)
export const bindEventsTodoSpecificEvent = new CustomEvent(CustomTodoEvents.BIND_EVENTS)
export const removeCleanUpEvent = new CustomEvent(CustomTodoEvents.REMOVE_CLEANUP)
const editEvent = new CustomEvent(CustomTodoEvents.EDIT)
const moveEvent = new CustomEvent(CustomTodoEvents.MOVE)
const completeEvent = new CustomEvent(CustomTodoEvents.TOGGLE_COMPLETE)
const setInputStateEvent = new CustomEvent(CustomTodoEvents.SET_INPUT_STATE)
const removeSingleEvent = new CustomEvent(CustomTodoEvents.REMOVE_SINGLE)
const removeAllEvent = new CustomEvent(CustomTodoEvents.REMOVE_ALL)
const addEvent = new CustomEvent(CustomTodoEvents.ADD)

export const dispatchTodoCompletionEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.currentTarget?.dispatchEvent(completeEvent)
}

export const dispatchSetInputState = (event: Event) => {
    event.currentTarget?.dispatchEvent(setInputStateEvent);
}

export const dispatchEditTodoEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.currentTarget?.dispatchEvent(editEvent)
}

export const dispatchMoveTodoEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.currentTarget?.dispatchEvent(moveEvent)
}

export const dispatchRemoveSingleTodoEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.currentTarget?.dispatchEvent(removeSingleEvent)
}

export const dispatchRemoveAllTodoEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.currentTarget?.dispatchEvent(removeAllEvent)
}

export const addTodoEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.preventDefault();
    event.currentTarget?.dispatchEvent(addEvent)
}

export const fireGlobalEvent = (eventName: CustomEvent<unknown>) => {
    document.dispatchEvent(eventName)
}