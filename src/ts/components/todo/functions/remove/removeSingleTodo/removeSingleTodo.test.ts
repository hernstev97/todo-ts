const target = document.createElement('button');
target.setAttribute('data-id', 'uid#4tDI4v2Nb6')

const componentRootElement = document.createElement('div');
const todoList = document.createElement('div');
componentRootElement.setAttribute('data-component', 'todo')
todoList.setAttribute('data-todo', 'todoList');
todoList.classList.add('todo-list');
document.body.appendChild(componentRootElement);
componentRootElement.appendChild(todoList);

const targetTodo = document.createElement('div');
todoList.appendChild(targetTodo);
targetTodo.setAttribute('data-todo', 'todoItem');
targetTodo.setAttribute('data-id', 'uid#40iV8A5404');
targetTodo.classList.add('todo');

targetTodo.innerHTML = `<div class="todo__flex-container">
                            <div class="todo__title" data-todo="todoTitle">
                                <p class="todo__label">Einkaufen</p>
                                <p class="todo__label todo__description">Brot, Nudeln, Küchenrolle</p>
                            </div>
                            <div class="todo__interaction-wrapper">
                                <div class="data-modification-wrapper">
                                    <input class="todo__interaction todo__interaction--done" data-todo="todoCompletedCheckbox" type="checkbox" data-id="uid#40iV8A5404">
                                    <button data-todo="editTodoButton" data-modal="edit" class="todo__interaction todo__interaction--edit" data-id="uid#40iV8A5404">Bearbeiten</button>
                                    <button data-todo="deleteSingleTodoButton" class="todo__interaction--delete todo__interaction" data-id="uid#40iV8A5404">Entfernen</button>
                                </div>
                                <div class="move-wrapper">
                                    <button class="todo__move todo__move--up" data-id="uid#40iV8A5404" data-movetodoindirection="up">
                                        <span></span>
                                    </button>
                                    <button class="todo__move todo__move--down" data-id="uid#40iV8A5404" data-movetodoindirection="down">
                                        <span></span>
                                    </button>
                                </div>
                            </div>
                        </div>`