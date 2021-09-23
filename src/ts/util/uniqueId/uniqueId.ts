import {LocalStorageKeys} from "../../enums/LocalStorageKeysEnum";
import {getLocalStorage, setLocalStorage} from "../localStorageUtility";

let allIds: string[] = [];

export default function getUniqueId(): string {
    allIds = getLocalStorage(LocalStorageKeys.UIDS) ?? [];
    const alphabet: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    const randomNumber = Math.floor(floorRandomNumber(Math.random() * Date.now()));
    const randomNumberAsString = randomNumber.toString();
    let uniqueId = `uid#${generateRandomString(randomNumberAsString, alphabet)}`;

    while (allIds.some(id => id === uniqueId)) {
        uniqueId = `uid#${generateRandomString(randomNumberAsString, alphabet)}`;
    }
    allIds.push(uniqueId);
    setLocalStorage(LocalStorageKeys.UIDS, allIds)

    return uniqueId;
}

// to make reading a bit easier
const floorRandomNumber = (factor: number): number => {
    return Math.floor(Math.random() * factor)
}

const generateRandomString = (randomNumberAsString: string, alphabet: string[]) => {
    const uid = randomNumberAsString.split('').map((number, index) => {
        const randomLetter = alphabet[floorRandomNumber(alphabet.length)]
        const lowerOrUpperCaseLetter = floorRandomNumber(10) % 4 ? randomLetter.toUpperCase() : randomLetter
        return (index + 1) % (floorRandomNumber(4) + 1) ? number : lowerOrUpperCaseLetter;
    }).join('');

    return uid.substring(0, Math.min(uid.length, 10));
}