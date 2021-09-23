import { dispatchSetInputState } from "../../../events/CustomEvents";
import { handleEditSubmit } from "../edit";

export const removeEditInput = (input: HTMLInputElement, currentlyEditedTitle: Element) => {
    currentlyEditedTitle.classList.remove('todo__title--edit');
    input.removeEventListener('keydown', handleEditSubmit);
    input.removeEventListener('input', dispatchSetInputState);
}