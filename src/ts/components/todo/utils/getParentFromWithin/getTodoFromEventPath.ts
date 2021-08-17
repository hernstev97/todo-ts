export // todo rename
const getTodoFromEventPath = (path: EventTarget[]): HTMLElement => {
    return path.find(element => (element as HTMLElement).classList.contains('todo')) as HTMLElement;
}