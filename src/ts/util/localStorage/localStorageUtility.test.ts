import { 
    getLocalStorage,
    setLocalStorage
} from "./localStorageUtility";

test('sets to and gets from localstorage', () => {
    setLocalStorage('test', 'this is a test')
    expect(getLocalStorage('test')).toEqual('this is a test')
});