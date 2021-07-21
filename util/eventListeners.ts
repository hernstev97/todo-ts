export function assignSingleEventListener(
    element: any,
    eventType: string,
    callbackFunction: (event: Event) => void
) {
    element.addEventListener(eventType, (event: Event) => {
        callbackFunction(event);
    })
}

export function assignBulkEventListeners(
    elements: NodeListOf<Element>,
    eventType: string,
    callbackFunction: (event: Event) => void
) {
    elements.forEach(element => {
        element.addEventListener(eventType, (event) => {
            callbackFunction(event);
        })
    })
}

export function removeSingleEventListener(
    element: any,
    eventType: string,
    callbackFunction: (event: Event) => void
) {
    element.removeEventListener(eventType, (event: Event) => {
        callbackFunction(event);
    })
}

export function removeBulkEventListeners(
    elements: NodeListOf<Element>,
    eventType: string,
    callbackFunction: (event: Event) => void
) {
    elements.forEach(element => {
        element.removeEventListener(eventType, (event) => {
            callbackFunction(event);
        })
    })
}