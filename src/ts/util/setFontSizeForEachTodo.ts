// This enum defines how many characters are allowed
// within a given text, before a smaller font size is set
enum CharacterAmountThreshold {
    MOBILE_LITTLE = 27,
    TABLET_LITTLE = 61,
    DESKTOP_LITTLE = 106,
    MOBILE_MEDIUM = 50,
    TABLET_MEDIUM = 90,
    DESKTOP_MEDIUM = 146,
    MOBILE_BIG = 100,
    TABLET_BIG = 146,
    DESKTOP_BIG = 292,
}

export function getFontSizeREM(text: HTMLParagraphElement, deviceOutput: string) {
    if (!text.textContent) return text.style.fontSize;

    const textLength = text.textContent.length;
    let fontSize = 1.2;

    if (deviceOutput === 'mobile') {
        if (textLength >= CharacterAmountThreshold.MOBILE_LITTLE)
            fontSize = 1.2;
        if (textLength >= CharacterAmountThreshold.MOBILE_MEDIUM)
            fontSize = 1;
        if (textLength >= CharacterAmountThreshold.MOBILE_BIG)
            fontSize = 0.85;
    }

    if (deviceOutput === 'tablet') {
        if (textLength < CharacterAmountThreshold.TABLET_LITTLE)
            fontSize = 1.3;
        if (textLength >= CharacterAmountThreshold.TABLET_LITTLE)
            fontSize = 1.1;
        if (textLength >= CharacterAmountThreshold.TABLET_MEDIUM)
            fontSize = 1;
        if (textLength >= CharacterAmountThreshold.TABLET_BIG)
            fontSize = 0.8;
    }

    if (deviceOutput === 'desktop') {
        if (textLength < CharacterAmountThreshold.DESKTOP_LITTLE)
            fontSize = 1.4;
        if (textLength >= CharacterAmountThreshold.DESKTOP_LITTLE)
            fontSize = 1.2;
        if (textLength >= CharacterAmountThreshold.DESKTOP_MEDIUM)
            fontSize = 1;
        if (textLength >= CharacterAmountThreshold.DESKTOP_BIG)
            fontSize = 0.8;
    }

    return `${fontSize}rem`
}

export default function setFontSizeForEachTodo(allTodos: NodeListOf<Element>, deviceOutput: string) {
    allTodos.forEach(todo => {
        const text = todo.querySelector('.todo__label') as HTMLParagraphElement;

        if (text.textContent)
            text.style.fontSize = getFontSizeREM(text, deviceOutput)
    })
}