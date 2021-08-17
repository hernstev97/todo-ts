import { MovingDirectionType } from "../../types/MovingDirectionType";
import TodoItem from "../../interfaces/TodoItem";
import swapArrayElementPositions from "../../../../util/swapArrayElementPositions/swapArrayElementPositions";

export const swapTodoIndexByDirection = (todoItems: TodoItem[], index: number, direction: MovingDirectionType): TodoItem[] => {
    if (direction === 'up')
        return swapArrayElementPositions(todoItems, index, index - 1);

    return swapArrayElementPositions(todoItems, index, index + 1);
}