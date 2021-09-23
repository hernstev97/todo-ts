export const getIdOfCurrentTarget = (event: CustomEvent) => {
    const element = event.currentTarget as HTMLElement;
    return element.dataset.id;
}