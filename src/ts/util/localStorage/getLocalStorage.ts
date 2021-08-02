export default function getLocalStorage<T>(key: string) {
    const localStorage = window.localStorage.getItem(key);
    if (
        localStorage !== null
        && localStorage !== 'undefined'
        && localStorage !== ''
    ) {
        return JSON.parse(localStorage);
    }
}