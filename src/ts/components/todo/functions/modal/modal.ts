export const modal = () => {
    const modalWrapper = document.querySelector('[data-component="modalWrapper"]') as HTMLElement;
    const closeButton = modalWrapper.querySelector('[data-modal="closeModalButton"]') as HTMLButtonElement;

    const open = (title: string) => {
        const heading = modalWrapper.querySelector('h2') as HTMLHeadingElement;
        document.body.classList.add('scrolllock');
        modalWrapper.classList.remove('modal-hidden');
        heading.textContent = title;
        closeButton.addEventListener('click', close)
    }

    const close = () => {
        document.body.classList.remove('scrolllock');
        modalWrapper.classList.add('modal-hidden');
        closeButton.removeEventListener('click', close)
    }

    return {
        open,
        close
    }
}