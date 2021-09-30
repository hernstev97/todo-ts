import TodoItem from "../../interfaces/TodoItem";
import moveButton from "./moveButton";
import todoTitle from "./todoTitle";
import checkbox from "./checkbox";
import deleteTodo from "./deleteTodo";
import editTodo from "./editTodo";

export default function addTodoElementToDom(todoItem: TodoItem) {
    const todoList = document.querySelector('.todo-list') as HTMLDivElement;
    const todoDomElement = `
        <div data-todo="todoItem" class="todo ${todoItem.completed ? 'todo--completed' : ''}" data-id="${todoItem.id}">
            <div class="todo__flex-container">
                ${todoTitle(todoItem.title, todoItem.description)}
                <div class="todo__interaction-wrapper">
                    <div class="data-modification-wrapper">
                        ${checkbox(todoItem.id, todoItem.completed)}
                        ${editTodo(todoItem.id)}
                        ${deleteTodo(todoItem.id)}
                    </div>
                    <div class="move-wrapper">
                        ${moveButton(todoItem.id, 'up')}
                        ${moveButton(todoItem.id, 'down')}
                    </div>
                    
                </div>
            </div>
        </div>`

    todoList.insertAdjacentHTML('beforeend', todoDomElement);
}