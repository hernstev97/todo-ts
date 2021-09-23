import { removeEditInput } from "../removeEditInput/removeEditInput";

export const cancelEdit = (input: HTMLInputElement, currentlyEditedTitle: Element) => {
    input.value = currentlyEditedTitle.querySelector('p')?.textContent as string;
    removeEditInput(input, currentlyEditedTitle);
}