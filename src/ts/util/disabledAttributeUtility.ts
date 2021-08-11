export const setDisabledAttribute = <T extends Element>(selector: T, elementToDisable: string) => {
    const test = selector.querySelector(elementToDisable)
    if (test !== null)
        test.setAttribute('disabled', '');
}

export const removeDisabledAttribute = <T extends Element>(selector: T, elementToDisable: string) => {
    if (selector.querySelector(elementToDisable) === null) {
        return;
    }

    (selector.querySelector(elementToDisable) as T).removeAttribute('disabled');
}