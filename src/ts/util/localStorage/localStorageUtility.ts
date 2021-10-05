export function getLocalStorage<T>(key: string) {
    const storage = localStorage.getItem(key);
    if (
        storage !== null
        && storage !== 'undefined'
        && storage !== ''
    ) {
        return JSON.parse(storage);
    }
}

export function setLocalStorage<T>(key: string, object: T) {
    localStorage.setItem(key, JSON.stringify(object));
}