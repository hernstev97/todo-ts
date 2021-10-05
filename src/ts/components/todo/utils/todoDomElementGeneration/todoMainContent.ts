export default function todoMainContent(title: string, description?: string) {
    const titleHTML = `<p class="todo__label">${title}</p>`;
    const descriptionHTML = `<p class="todo__label todo__description">${description}</p>`;

    return `<div class="todo__title" data-todo="todoTitle">
            ${titleHTML}
            ${descriptionHTML}
        </div>`
}