export function assignBulkEventListeners(
    elements: NodeListOf<Element>,
    eventType: string,
    callbackFunction: (event: Event | MouseEvent) => void
) {
    elements.forEach(element => {
        element.addEventListener(eventType, (event: Event | MouseEvent) => {
            callbackFunction(event);
        })
    })
}

export function removeBulkEventListeners(
    elements: NodeListOf<Element>,
    eventType: string,
    callbackFunction: (event: Event | MouseEvent) => void
) {
    elements.forEach(element => {
        element.removeEventListener(eventType, (event: Event | MouseEvent) => {
            callbackFunction(event);
        })
    })
}