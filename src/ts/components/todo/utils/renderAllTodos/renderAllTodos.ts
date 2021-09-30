import TodoItem from "../../interfaces/TodoItem";
import addTodoElementToDom from "../todoDomElementGeneration/addElementToDom";

export const renderAllTodos = (todos: TodoItem[], todoList: HTMLDivElement) => {
    todoList.innerHTML = '';
    todos.forEach(item => {
        addTodoElementToDom({
            id: item.id,
            title: item.title,
            description: item.description,
            completed: item.completed,
        });
    });
}