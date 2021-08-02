export default function setLocalStorage<T>(key: string, object: T) {
    window.localStorage.setItem(key, JSON.stringify(object));
}