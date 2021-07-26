export const setDisabledAttribute = <T extends Element>(selector: T, elementToDisable: string) => {
    if (selector.querySelector(elementToDisable) === null) {
        return;
    }

    // todo ask why this can still be null
    (selector.querySelector(elementToDisable) as T).setAttribute('disabled', '');
}