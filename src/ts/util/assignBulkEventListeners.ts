export function assignBulkEventListeners<T extends Element>(
    elements: T[],
    eventType: string,
    callbackFunction: (event: Event | MouseEvent | CustomEvent) => void
) {
    elements.forEach(element => {
        element.addEventListener(eventType, (event: Event | MouseEvent | CustomEvent) => {
            callbackFunction(event);
        })
    })
}