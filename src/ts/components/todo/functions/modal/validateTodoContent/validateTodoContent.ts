import validateInput from "../../../../../util/validateInput/validateInput";

export const validateTodoContent = (title: string, description?: string) => {
    if (description)
        return validateInput(title) && validateInput(description)

    return validateInput(title);
}