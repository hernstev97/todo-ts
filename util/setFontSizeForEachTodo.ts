// This enum defines how many characters are allowed
// within a given text, before a smaller font size is set

enum CharacterThreshold {
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

function getFontSize(text: HTMLParagraphElement, deviceOutput: string) {
    if (!text.textContent) {
        return text.style.fontSize;
    }
    const textLength = text.textContent.length;
    let fontSize = 1.2;
    if (deviceOutput === 'mobile') {
        if (textLength >= CharacterThreshold.MOBILE_LITTLE) {
            fontSize = 1.2;
        }
        if (textLength >= CharacterThreshold.MOBILE_MEDIUM) {
            fontSize = 1;
        }
        if (textLength >= CharacterThreshold.MOBILE_BIG) {
            fontSize = 0.85;
        }
    }

    if (deviceOutput === 'tablet') {
        if (textLength < CharacterThreshold.TABLET_LITTLE) {
            fontSize = 1.3;
        }
        if (textLength >= CharacterThreshold.TABLET_LITTLE) {
            fontSize = 1.1;
        }
        if (textLength >= CharacterThreshold.TABLET_MEDIUM) {
            fontSize = 1.0;
        }
        if (textLength >= CharacterThreshold.TABLET_BIG) {
            fontSize = 0.8;
        }
    }

    if (deviceOutput === 'desktop') {
        if (textLength < CharacterThreshold.DESKTOP_LITTLE) {
            fontSize = 1.4;
        }
        if (textLength >= CharacterThreshold.DESKTOP_LITTLE) {
            fontSize = 1.2;
        }
        if (textLength >= CharacterThreshold.DESKTOP_MEDIUM) {
            fontSize = 1.0;
        }
        if (textLength >= CharacterThreshold.DESKTOP_BIG) {
            fontSize = 0.8;
        }
    }

    return `${fontSize}rem`
}

export default function setFontSizeForEachTodo(allTodos: NodeListOf<Element>, deviceOutput: string) {
    allTodos.forEach(todo => {
        const text = todo.querySelector('.todo__label') as HTMLParagraphElement;

        if (text.textContent)
            text.style.fontSize = getFontSize(text, 'mobile')
    })
}