import { MovingDirectionType } from "../../types/MovingDirectionType";

export const getSelectedDirection = (moveButton: HTMLButtonElement, direction: MovingDirectionType): boolean => {
    return moveButton.dataset.movetodoindirection === direction;
}