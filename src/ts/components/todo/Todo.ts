import TodoItem from "../../interfaces/TodoItem";
import allItemsRemoveButtonVisibilityHandler from "../../util/allItemsRemoveButtonVisibilityHandler";
import { assignBulkEventListeners } from "../../util/assignBulkEventListeners";
import setFontSizeForEachTodo from "../../util/setFontSizeForEachTodo";
import getDeviceOutput from "../../util/getDeviceOutput";
import { setLocalStorage, getLocalStorage } from "../../util/localStorageUtility";
import addTodoElementToDom from "../../util/addElementToDom";
import { setDisabledAttribute, removeDisabledAttribute } from "../../util/disabledAttributeUtility";
import { swapArrayElementPositions } from "../../util/swapArrayElementPositions";
import { getUniqueId } from "../../util/uniqueId";
import validateInput from "../../util/validateInput";

export const todo = () => {
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    const removeAllItemsButton = componentRoot.querySelector('[data-todo="removeAllItemsButton"]') as HTMLButtonElement;
    const addTodoTextInput = componentRoot.querySelector('[data-todo="addTodoTextInput"]') as HTMLInputElement;
    const addTodoFormElement = componentRoot.querySelector('[data-todo="addTodoForm"]') as HTMLFormElement;
    const todoList = componentRoot.querySelector('[data-todo="todoList"]') as HTMLDivElement
    let todoElementNodeList: NodeListOf<Element>;
    let todoDoneCheckboxList: HTMLInputElement[];
    let deleteSingleTodoButtonList: HTMLButtonElement[];
    let moveTodoInDirectionButtonList: HTMLButtonElement[];
    let todoTitleList: HTMLDivElement[];
    // general
    let todoItems: TodoItem[] = [];
    let inputState: string = '';
    let timeout: number;
    let uniqueIdForThisTodo: string = '';
    // edit
    let currentTodoId: string | null;
    let modifiedTodoItems: TodoItem[] = [];
    let indexOfEditableTodoItem: number;
    let selectedEditableTodoItem: TodoItem | undefined;
    let currentlyEditedTitle: Element;

    const init = () => {
        buildTodosFromLocalStorage();
        setInteractionElements();
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
        setDisabledSortButtons();
        bindEvents();
        setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));

        console.log("getUniqueId()", getUniqueId())
    }

    const bindEvents = () => {
        addTodoTextInput.addEventListener( 'input', setInputState);

        addTodoFormElement.addEventListener('submit', handleFormSubmit);

        removeAllItemsButton.addEventListener('click', handleDeleteAllButtonClick);

        assignBulkEventListeners(todoDoneCheckboxList, 'change', toggleTodoComplete);

        assignBulkEventListeners(deleteSingleTodoButtonList, 'click', handleDeleteTodo);

        assignBulkEventListeners(moveTodoInDirectionButtonList, 'click', handleMoveTodo);

        assignBulkEventListeners(todoTitleList, 'dblclick', handleEditTodoLabel);

        window.addEventListener('resize', () => {
            clearTimeout(timeout);

            timeout = window.setTimeout(() => {
                // first gets the font size via a text length comparison
                // then sets it to a value between 0.8 and 1.4 depending on
                // deviceOutput and which threshold is passed
                setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));
            }, 250);
        });
    }

    // general functions
    const buildTodosFromLocalStorage = () => {
        const todoItemsFromStorage = getLocalStorage('todoItems');
        todoItems = todoItemsFromStorage === undefined ? [] : todoItemsFromStorage;
        renderAllTodos(todoItems);
    }

    const setInteractionElements = () => {
        todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');
        todoDoneCheckboxList = Array.from(componentRoot.querySelectorAll('[data-todo="todoCompletedCheckbox"]')) as HTMLInputElement[];
        deleteSingleTodoButtonList = Array.from(componentRoot.querySelectorAll('[data-todo="deleteSingleTodoButton"]')) as HTMLButtonElement[];
        moveTodoInDirectionButtonList = Array.from(componentRoot.querySelectorAll('[data-moveTodoInDirection]')) as HTMLButtonElement[];
        todoTitleList = Array.from(componentRoot.querySelectorAll('[data-todo="todoTitle"]')) as HTMLDivElement[];
    }

    const renderAllTodos = (todos: TodoItem[]) => {
        todoList.innerHTML = '';
        todos.forEach(item => {
            addTodoElementToDom({
                id: item.id,
                title: item.title,
                completed: item.completed,
            });
        });
    }

    // adding a todoItem
    const setInputState = (event: Event) => {
        const input = event?.target as HTMLInputElement;
        inputState = input.value ?? '';
    }

    const addTodoItem = () => {
        if (addTodoTextInput.value.length === 0) return;

        uniqueIdForThisTodo = getUniqueId();

        const todoItem: TodoItem = {
            id: uniqueIdForThisTodo,
            title: inputState,
            completed: false,
        }

        todoItems.push(todoItem);
        setLocalStorage('todoItems', todoItems);
        addTodoTextInput.value = '';
        inputState = '';
    }

    const createNewTodoDOMElement = () => {
        const indexForNewItem = todoItems.length - 1
        const newTodo = todoItems[indexForNewItem];
        addTodoElementToDom({
            id: uniqueIdForThisTodo,
            title: newTodo.title,
            completed: newTodo.completed,
        });

        setInteractionElements();
        todoDoneCheckboxList[indexForNewItem].addEventListener('change', toggleTodoComplete)
        deleteSingleTodoButtonList[indexForNewItem].addEventListener('click', handleDeleteTodo)
        todoTitleList[indexForNewItem].addEventListener('dblclick', handleEditTodoLabel);
        moveTodoInDirectionButtonList.forEach(button => {
            if (button.getAttribute('data-id') === newTodo.id)
                button.addEventListener('click', handleMoveTodo);
        })
    }

    const handleFormSubmit = (event: Event) => {
        event.preventDefault();
        if (validateInput(inputState)) {
            addTodoItem();
            createNewTodoDOMElement();
            allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
            setDisabledSortButtons();
        }
    }

    // completing a todoItem
    const toggleTodoComplete = (event: Event) => {
        const element = event.currentTarget as HTMLElement;
        const id = element.dataset.id;
        const currentTodo = todoItems.find(item => item.id === id);
        const parent = element.parentElement?.parentElement;

        if (currentTodo === undefined) return;

        if (parent) {
            currentTodo.completed = !currentTodo.completed;

            if (currentTodo.completed)
                parent.classList.add('todo--completed');
            else
                parent.classList.remove('todo--completed');
        }

        setLocalStorage('todoItems', todoItems);
    }

    // deleting all todoItems
    const handleDeleteAllButtonClick = (event: Event) => {
        deleteAllTodos(event)
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    }

    const deleteAllTodos = (event: Event) => {
        event.preventDefault();

        uniqueIdForThisTodo = '';
        todoItems = [];
        setLocalStorage('todoItems', todoItems)
        todoElementNodeList.forEach(todo => {
            todo.remove();
        })
    }

    // deleting a single todoItem
    const handleDeleteTodo = (event: Event) => {
        deleteSingleTodo(event)
        setDisabledSortButtons();
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    }

    const deleteSingleTodo = (event: Event) => {
        event.preventDefault();
        const target = event.currentTarget as HTMLButtonElement;
        const id = target.dataset.id;
        const parent = Array.from(todoElementNodeList).find(todo => todo.getAttribute('data-id') === id);
        const toDeleteTodo = todoItems.find(item => item.id === id);
        const toDeleteTodoIndex = toDeleteTodo ? todoItems.indexOf(toDeleteTodo) : -1;

        for (let todoIndex = 0; todoIndex < todoItems.length; todoIndex++) {
            if (todoIndex === toDeleteTodoIndex)
                todoItems.splice(todoIndex, 1);
        }

        if (parent) parent.remove();

        setLocalStorage('todoItems', todoItems);
        todoElementNodeList = componentRoot.querySelectorAll('[data-todo="todoItem"]');

        if (todoItems.length === 0) {
            uniqueIdForThisTodo = '';
        }
    }

    // editing a todoItem
    const handleEditTodoLabel = (event: Event) => {
        currentlyEditedTitle = event.currentTarget as Element;
        currentlyEditedTitle.classList.add('todo__title--edit');
        modifiedTodoItems = Array.from(todoItems)
        const editTodoInput = currentlyEditedTitle.querySelector('[data-todo="editTodoInput"]') as HTMLInputElement;
        const parent = currentlyEditedTitle?.parentElement?.parentElement;
        currentTodoId = parent ? parent.getAttribute('data-id') : '';
        selectedEditableTodoItem = todoItems.find(todo => todo.id === currentTodoId);

        if (editTodoInput && selectedEditableTodoItem) {
            indexOfEditableTodoItem = todoItems.indexOf(selectedEditableTodoItem);
            editTodoInput.focus();
            editTodoInput.setSelectionRange(editTodoInput.value.length, editTodoInput.value.length);
            editTodoInput.addEventListener('input', setInputState);
            editTodoInput.addEventListener('keydown', handleEditSubmit);
            editTodoInput.addEventListener('keyup', (event) => {
                if (event.key === "Escape" || event.key === "Enter")
                    removeEditInput(editTodoInput);
            });
            editTodoInput.addEventListener('blur', () => { removeEditInput(editTodoInput) });
        }
    }

    const removeEditInput = (input: HTMLInputElement) => {
        currentlyEditedTitle.classList.remove('todo__title--edit');
        input.removeEventListener('keydown', handleEditSubmit);
        input.removeEventListener('input', setInputState);
    }

    const handleEditSubmit = (event: Event | KeyboardEvent) => {
        const { key } = event as KeyboardEvent;
        const todoLabel = currentlyEditedTitle.querySelector('p');
        const editTodoInput = currentlyEditedTitle.querySelector('[data-todo="editTodoInput"]') as HTMLInputElement;
        const newTitle = inputState.length > 0 ? inputState : editTodoInput.value;

        if (key === "Enter" && selectedEditableTodoItem && todoLabel && currentTodoId && validateInput(newTitle)) {
            modifiedTodoItems[indexOfEditableTodoItem] = {
                id: currentTodoId,
                title: newTitle,
                completed: selectedEditableTodoItem.completed
            };

            todoLabel.textContent = newTitle;
            todoItems = modifiedTodoItems;
            setLocalStorage('todoItems', modifiedTodoItems);
            setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));
        }
    }

    // moving a todoItem with buttons
    const setDisabledSortButtons = () => {
        if (todoItems.length > 0) {
            const firstTodo = todoElementNodeList[0];
            const lastTodo = todoElementNodeList[todoElementNodeList.length - 1];
            todoElementNodeList.forEach(todo => {
                removeDisabledAttribute(todo, '[data-moveTodoInDirection="up"]')
                removeDisabledAttribute(todo, '[data-moveTodoInDirection="down"]')
            })
            setDisabledAttribute(firstTodo, '[data-moveTodoInDirection="up"]')
            setDisabledAttribute(lastTodo, '[data-moveTodoInDirection="down"]')
        }
    }

    const handleMoveTodo = (event: Event) => {
        moveTodo(event);
        renderAllTodos(todoItems);
        setInteractionElements();
        setDisabledSortButtons();
        setFontSizeForEachTodo(todoElementNodeList, getDeviceOutput(window.innerWidth));

        // here all listeners for elements inside a todoElement have to be set again
        // because within the renderAllTodos function the innerHTML of the todolist ist emptied
        // which deletes all listeners as well
        assignBulkEventListeners(todoDoneCheckboxList, 'change', toggleTodoComplete);
        assignBulkEventListeners(deleteSingleTodoButtonList, 'click', handleDeleteTodo);
        assignBulkEventListeners(moveTodoInDirectionButtonList, 'click', handleMoveTodo);
        assignBulkEventListeners(todoTitleList, 'dblclick', handleEditTodoLabel);

        setLocalStorage('todoItems', todoItems);
    }

    const moveTodo = (event: Event) => {
        const moveButton = event.currentTarget as HTMLButtonElement;
        const buttonId = moveButton.getAttribute('data-id');
        const todoItemToMove = todoItems.find(item => item.id === buttonId) as TodoItem;
        const indexOfTodoItemToMove = todoItems.indexOf(todoItemToMove);

        if (moveButton.dataset.movetodoindirection === 'up')
            todoItems = swapArrayElementPositions(todoItems, indexOfTodoItemToMove, indexOfTodoItemToMove - 1);
        else if (moveButton.dataset.movetodoindirection === 'down')
            todoItems = swapArrayElementPositions(todoItems, indexOfTodoItemToMove, indexOfTodoItemToMove + 1);
    }

    return { init };
}