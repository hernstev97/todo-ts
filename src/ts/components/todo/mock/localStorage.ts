class LocalStorageMock {
    store: Record<string, any>;
    length: number;

    constructor() {
        this.store = {};
        this.length = 0;
    }

    key(index: number) {
        return `${index}`
    };

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

global.localStorage = new LocalStorageMock;