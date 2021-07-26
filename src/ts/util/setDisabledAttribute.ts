// todo rename file

export const setDisabledAttribute = <T extends Element>(selector: T, elementToDisable: string) => {
    if (selector.querySelector(elementToDisable) === null) {
        return;
    }

    // todo ask why this can still be null
    (selector.querySelector(elementToDisable) as T).setAttribute('disabled', '');
}

export const removeDisabledAttribute = <T extends Element>(selector: T, elementToDisable: string) => {
    if (selector.querySelector(elementToDisable) === null) {
        return;
    }

    (selector.querySelector(elementToDisable) as T).removeAttribute('disabled');
}