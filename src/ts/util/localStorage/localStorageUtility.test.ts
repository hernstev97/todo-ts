import { 
    getLocalStorage,
    setLocalStorage
} from "./localStorageUtility";
import { localStorage } from "../../components/todo/mock/localStorage";

describe('sets to and gets from localstorage', () => {
    test('gets from localstorage', () => {
        localStorage.setItem('test', 'this is a test');
        expect(getLocalStorage('test')).toEqual('this is a test')
    });

    // test('sets to localstorage', () => {

    // });
});