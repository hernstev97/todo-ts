export const getElementId = <T extends Element>(element: T): string | null => {
    return element.getAttribute('data-id');
}