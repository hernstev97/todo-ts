// @TEST local storage mock does not work yet

class LocalStorageMock {
    store: Record<string, any>

    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key: string) {
        return this.store[key] || null;
    }

    setItem(key: string, value: string) {
        this.store[key] = String(value);
    }

    removeItem(key: string) {
        delete this.store[key];
    }
}

export const localStorage = new LocalStorageMock;