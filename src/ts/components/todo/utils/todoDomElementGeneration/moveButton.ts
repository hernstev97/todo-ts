import { MovingDirectionType } from "../../../../types/MovingDirectionType";

export default function moveButton(id: string, direction: MovingDirectionType) {
    return `
        <button class="todo__move todo__move--${direction}" data-id="${id}" data-moveTodoInDirection="${direction}">
            <span></span>
        </button>`
}