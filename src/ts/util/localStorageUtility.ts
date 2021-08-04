export function getLocalStorage<T>(key: string) {
    const localStorage = window.localStorage.getItem(key);
    if (
        localStorage !== null
        && localStorage !== 'undefined'
        && localStorage !== ''
    ) {
        return JSON.parse(localStorage);
    }
}

export function setLocalStorage<T>(key: string, object: T) {
    window.localStorage.setItem(key, JSON.stringify(object));
}