export default function getUniqueId(): string {
    const alphabet: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    const randomNumber = Math.floor(floorRandomNumber(Math.random() * Date.now()));
    const randomNumberAsString = randomNumber.toString();
    // todo dont solve it like this
    // todo this way it depends on usage within an html document
    const doc = document.documentElement.innerHTML;
    let uniqueId = generateRandomString(randomNumberAsString, alphabet);

    while (doc.includes(`uid#${uniqueId}`))
        uniqueId = generateRandomString(randomNumberAsString, alphabet);

    return `uid#${uniqueId}`;
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