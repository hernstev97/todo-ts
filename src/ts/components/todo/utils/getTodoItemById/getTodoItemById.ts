import TodoItem from "../../interfaces/TodoItem";

export const getTodoItemById = (todoItems: TodoItem[], id: string | null | undefined): TodoItem | undefined => {
    if (id === null || id === undefined) return;
    return todoItems.find(item => item.id === id) as TodoItem
}