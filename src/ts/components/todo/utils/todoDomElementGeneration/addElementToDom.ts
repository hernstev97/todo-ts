import TodoItem from "../../../../interfaces/TodoItem";
import moveButton from "./moveButton";
import todoTitle from "./todoTitle";
import moveGrabber from "./moveGrabber";
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
            ${moveGrabber()}
        </div>`

    // todoList.innerHTML += todoDomElement;
    // had to change from innerHTML to insertAdjacentHTML
    // because with innerHTML all the DOM Elements are basically rebuild.
    // so all event listeners would have to be reset. see the link below.
    // https://stackoverflow.com/questions/5113105/manipulating-innerhtml-removes-the-event-handler-of-a-child-element
    todoList.insertAdjacentHTML('beforeend', todoDomElement)

}