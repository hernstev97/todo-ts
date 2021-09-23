import TodoItem from "../../interfaces/TodoItem";
import moveButton from "./moveButton";
import todoTitle from "./todoTitle";
import checkbox from "./checkbox";
import deleteTodo from "./deleteTodo";

export default function addTodoElementToDom(todoItem: TodoItem) {
    const todoList = document.querySelector('.todo-list') as HTMLDivElement;
    const todoDomElement = `
        <div data-todo="todoItem" class="todo ${todoItem.completed ? 'todo--completed' : ''}" data-id="${todoItem.id}">
            <div class="todo__flex-container">
                ${checkbox(todoItem.id, todoItem.completed)}
                ${todoTitle(todoItem.title)}
                <div class="todo__move-delete-wrapper">
                    ${moveButton(todoItem.id, 'up')}
                    ${deleteTodo(todoItem.id)}
                    ${moveButton(todoItem.id, 'down')}
                </div>
            </div>
        </div>`

    todoList.insertAdjacentHTML('beforeend', todoDomElement);
}