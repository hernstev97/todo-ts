import { CustomTodoEvents } from "../enums/CustomTodoEventsEnum";

export const setInteractionElementsEvent = new CustomEvent(CustomTodoEvents.SET_INTERACTION_ELEMENTS)
export const setDisabledSortButtonsEvent = new CustomEvent(CustomTodoEvents.SET_DISABLED_SORT_BUTTONS)
export const bindEventsTodoSpecificEvent = new CustomEvent(CustomTodoEvents.BIND_EVENTS)
export const removeCleanUpEvent = new CustomEvent(CustomTodoEvents.REMOVE_CLEANUP)
const moveEvent = new CustomEvent(CustomTodoEvents.MOVE)
const completeEvent = new CustomEvent(CustomTodoEvents.TOGGLE_COMPLETE)
const setTitleStateEvent = new CustomEvent(CustomTodoEvents.SET_TITLE_STATE)
const setDescriptionStateEvent = new CustomEvent(CustomTodoEvents.SET_DESCRIPTION_STATE)
const removeSingleEvent = new CustomEvent(CustomTodoEvents.REMOVE_SINGLE)
const removeAllEvent = new CustomEvent(CustomTodoEvents.REMOVE_ALL)
const addEvent = new CustomEvent(CustomTodoEvents.ADD)
const editEvent = new CustomEvent(CustomTodoEvents.EDIT)

export const dispatchTodoCompletionEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.currentTarget?.dispatchEvent(completeEvent)
}

export const dispatchSetTitleState = (event: Event) => {
    event.currentTarget?.dispatchEvent(setTitleStateEvent);
}

export const dispatchSetDescriptionState = (event: Event) => {
    event.currentTarget?.dispatchEvent(setDescriptionStateEvent);
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

export const dispatchEditTodoEvent = (event: Event | MouseEvent | CustomEvent) => {
    event.currentTarget?.dispatchEvent(editEvent)
}

export const fireGlobalEvent = (eventName: CustomEvent<unknown>) => {
    document.dispatchEvent(eventName)
}