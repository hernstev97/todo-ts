import TodoItem from "../../interfaces/TodoItem";
import allItemsRemoveButtonVisibilityHandler from "../../util/allItemsRemoveButtonVisibilityHandler";
import { assignBulkEventListeners } from "../../util/eventListeners";
import setFontSizeForEachTodo from "../../util/setFontSizeForEachTodo";
import { getDeviceOutput } from "../../util/getDeviceOutput";
import { getObjectInLocalStorage, setObjectInLocalStorage } from "../../util/setObjectInLocalStorage";
import addTodoElementToDom from "../../util/addElementToDom";
import { setDisabledAttribute, removeDisabledAttribute } from "../../util/setDisabledAttribute";
import { swapArrayElementPositions } from "../../util/swapArrayElementPositions";

export const todo = () => {
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    const removeAllItemsButton = componentRoot.querySelector('[data-todo="removeAllItemsButton"]') as HTMLButtonElement;
    const addTodoTextInput = componentRoot.querySelector('[data-todo="addTodoTextInput"]') as HTMLInputElement;
    const addTodoFormElement = componentRoot.querySelector('[data-todo="addTodoForm"]') as HTMLFormElement;
    const todoList = componentRoot.querySelector('[data-todo="todoList"]') as HTMLDivElement
    let todoDomElementList: NodeListOf<Element>;
    let todoDoneCheckboxList: HTMLInputElement[];
    let deleteSingleTodoButtonList: HTMLButtonElement[];
    let dragAndDropSortGrabberList: HTMLDivElement[];
    let moveTodoInDirectionButtonList: HTMLButtonElement[];
    let todoTitleList: HTMLDivElement[];
    // general
    let todoItems: TodoItem[] = [];
    let inputState: string = '';
    let timeout: number;
    let amountOfTodosIncludingDeleted: number = 0;
    // edit
    let currentTodoId: number;
    let modifiedTodoItems: TodoItem[] = [];
    let indexOfEditableTodoItem: number;
    let selectedEditableTodoItem: TodoItem | undefined;
    let currentlyEditedTitle: Element; // todo ?rename
    // drag/drop
    let isCurrentlyHoldingItem: boolean;
    let heldGrabber: HTMLDivElement | null; // todo ?rename
    let currentlyMovableTodo: HTMLDivElement | null;
    let currentlyMovableTodoRect: DOMRect | null;

    const init = () => {
        buildTodosFromLocalStorage();
        setInteractionElements();
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
        setDisabledSortButtons();
        bindEvents();
        setFontSizeForEachTodo(todoDomElementList, getDeviceOutput());
        console.log("positionOfTodos", positionOfTodos())
    }

    const bindEvents = () => {
        addTodoTextInput.addEventListener( 'input', setInputState)

        addTodoFormElement.addEventListener('submit', handleFormSubmit)

        removeAllItemsButton.addEventListener('click', handleDeleteAllTodos)

        window.addEventListener( 'mouseup', releaseItemHandler)

        assignBulkEventListeners(todoDoneCheckboxList, 'change', toggleTodoComplete);

        assignBulkEventListeners(deleteSingleTodoButtonList, 'click', handleDeleteTodo)

        assignBulkEventListeners(dragAndDropSortGrabberList, 'mousedown', holdItemHandler)

        assignBulkEventListeners(moveTodoInDirectionButtonList, 'click', handleMoveTodo)

        assignBulkEventListeners(todoTitleList, 'dblclick', handleEditTodoLabel)

        window.addEventListener('resize', () => {
            clearTimeout(timeout);

            timeout = window.setTimeout(() => {
                // first gets the font size via a text length comparison
                // then sets it to a value between 0.8 and 1.4 depending on
                // deviceOutput and which threshold is passed
                setFontSizeForEachTodo(todoDomElementList, getDeviceOutput());
            }, 250);
        })
    }

    const buildTodosFromLocalStorage = () => {
        const todoItemsFromStorage = getObjectInLocalStorage('todoItems');
        todoItems = todoItemsFromStorage === undefined ? [] : todoItemsFromStorage;
        amountOfTodosIncludingDeleted = getObjectInLocalStorage('amountOfTodosIncludingDeleted')
        renderAllTodos(todoItems);
    }

    // todo rename
    const setInteractionElements = () => {
        todoDomElementList = componentRoot.querySelectorAll('[data-todo="todoItem"]');
        todoDoneCheckboxList = Array.from(componentRoot.querySelectorAll('[data-todo="todoCompletedCheckbox"]')) as HTMLInputElement[];
        deleteSingleTodoButtonList = Array.from(componentRoot.querySelectorAll('[data-todo="deleteSingleTodoButton"]')) as HTMLButtonElement[];
        dragAndDropSortGrabberList = Array.from(componentRoot.querySelectorAll('[data-todo="dragAndDropSortGrabber"]')) as  HTMLDivElement[];
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

    const setInputState = (event: Event) => {
        const input = event?.target as HTMLInputElement;
        inputState = input.value ?? '';
    }

    const toggleTodoComplete = (event: Event) => {
        const element = event.currentTarget as HTMLElement;
        const id = element.dataset.id;
        const currentTodo = todoItems.find(item => `${item.id}` === id);
        const parent = element.parentElement?.parentElement;

        if (currentTodo === undefined) return;

        if (parent) {
            currentTodo.completed = !currentTodo.completed;

            if (currentTodo.completed)
                parent.classList.add('todo--completed');
            else
                parent.classList.remove('todo--completed');
        }

        setObjectInLocalStorage('todoItems', todoItems);
    }

    // todo make sure every function is as generic and reusable as possible
    //  its use should be obvious
    const setDisabledSortButtons = () => {
        if (todoItems.length > 0) {
            const firstTodo = todoDomElementList[0];
            const lastTodo = todoDomElementList[todoDomElementList.length - 1];
            todoDomElementList.forEach(todo => {
                removeDisabledAttribute(todo, '[data-moveTodoInDirection="up"]')
                removeDisabledAttribute(todo, '[data-moveTodoInDirection="down"]')
            })
            setDisabledAttribute(firstTodo, '[data-moveTodoInDirection="up"]')
            setDisabledAttribute(lastTodo, '[data-moveTodoInDirection="down"]')
        }
    }

    const handleDeleteAllTodos = (event: Event) => {
        deleteAllTodos(event)
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    }

    const deleteAllTodos = (event: Event) => {
        event.preventDefault();

        setObjectInLocalStorage('todoItems', [])
        setObjectInLocalStorage('amountOfTodosIncludingDeleted', null)
        amountOfTodosIncludingDeleted = 0;
        todoItems = [];
        todoDomElementList.forEach(todo => {
            todo.remove();
        })
    }

    const handleDeleteTodo = (event: Event) => {
        deleteSingleTodo(event)
        setDisabledSortButtons();
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
    }

    const deleteSingleTodo = (event: Event) => {
        event.preventDefault();
        const target = event.currentTarget as HTMLButtonElement;
        const id = target.dataset.id;
        const parent = Array.from(todoDomElementList).find(todo => todo.getAttribute('data-id') === id);
        const currentTodo = todoItems.find(item => `${item.id}` === id);
        const currentTodoIndex = currentTodo ? todoItems.indexOf(currentTodo) : -1;

        for (let i = 0; i < todoItems.length; i++) {
            if (i === currentTodoIndex) {
                todoItems.splice(i, 1);
            }
        }

        if (parent)
            parent.remove();

        setObjectInLocalStorage('todoItems', todoItems);
        todoDomElementList = componentRoot.querySelectorAll('[data-todo="todoItem"]');

        if (todoItems.length === 0) {
            setObjectInLocalStorage('amountOfTodosIncludingDeleted', null)
            amountOfTodosIncludingDeleted = 0;
        }
    }

    // each function should serve 1 purpose and be relatively generic. it should be usable at multiple places.
    const handleFormSubmit = (event: Event) => {
        event.preventDefault();
        if (inputState.length > 0) {
            addTodoItem();
            createNewTodoDOMElement();
            allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
            setDisabledSortButtons();
        }
    }

    const addTodoItem = () => {
        if (addTodoTextInput.value.length === 0 || componentRoot === null) {
            return;
        }

        amountOfTodosIncludingDeleted += 1;

        const todoItem: TodoItem = {
            id: amountOfTodosIncludingDeleted,
            title: inputState,
            completed: false,
        }

        todoItems.push(todoItem);
        setObjectInLocalStorage('todoItems', todoItems);
        setObjectInLocalStorage('amountOfTodosIncludingDeleted', amountOfTodosIncludingDeleted);
        addTodoTextInput.value = '';
        inputState = '';
    }

    const createNewTodoDOMElement = () => {
        const indexForNewItem = todoItems.length - 1
        const newTodo = todoItems[indexForNewItem];
        addTodoElementToDom({
            id: amountOfTodosIncludingDeleted,
            title: newTodo.title,
            completed: newTodo.completed,
        });

        setInteractionElements();
        todoDoneCheckboxList[indexForNewItem].addEventListener('change', toggleTodoComplete)
        deleteSingleTodoButtonList[indexForNewItem].addEventListener('click', handleDeleteTodo)
        dragAndDropSortGrabberList[indexForNewItem].addEventListener('mousedown', holdItemHandler)
        todoTitleList[indexForNewItem].addEventListener('dblclick', handleEditTodoLabel);
        moveTodoInDirectionButtonList.forEach(button => {
            if (button.getAttribute('data-id') === `${newTodo.id}`)
                button.addEventListener('click', handleMoveTodo);
        })
    }

    const handleEditTodoLabel = (event: Event) => {
        currentlyEditedTitle = event.currentTarget as Element;
        currentlyEditedTitle.classList.add('todo__title--edit');
        modifiedTodoItems = Array.from(todoItems)
        const editTodoInput = currentlyEditedTitle.querySelector('[data-todo="editTodoInput"]') as HTMLInputElement;
        const parent = currentlyEditedTitle?.parentElement?.parentElement;

        if (editTodoInput && parent) {
            currentTodoId = Number(parent.getAttribute('data-id'));
            selectedEditableTodoItem = todoItems.find(todo => todo.id === currentTodoId);

            if (selectedEditableTodoItem) {
                indexOfEditableTodoItem = todoItems.indexOf(selectedEditableTodoItem);
                editTodoInput.focus();
                editTodoInput.setSelectionRange(editTodoInput.value.length, editTodoInput.value.length);
                editTodoInput.addEventListener('input', setInputState);
                editTodoInput.addEventListener('keydown', handleEditSubmit);
                editTodoInput.addEventListener('keyup', (event) => {
                    if (event.key === "Escape" || event.key === "Enter") {
                        removeEditInput(editTodoInput);
                    }
                });
                editTodoInput.addEventListener('blur', () => { removeEditInput(editTodoInput) });
            }
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
        if (key === "Enter" && selectedEditableTodoItem && todoLabel) {
            modifiedTodoItems[indexOfEditableTodoItem] = {
                id: currentTodoId,
                title: newTitle,
                completed: selectedEditableTodoItem.completed
            };

            todoLabel.textContent = newTitle;
            todoItems = modifiedTodoItems;
            setObjectInLocalStorage('todoItems', modifiedTodoItems);
        }
    }

    // ================ //
    // DRAG N DROP SORT //
    // ================ //
    /* todo get position of all todos while grabbing
     * todo delete positions after releasing grab
     * todo if y-position of currently held item is >= OR <= any item it takes its position, depending on movement up or down
     * [#1 item]
     * [#2 movingItem] <-- this will not take the position of #1 just because it is beyond the y-position of #1.
     * [#3 item]           only if #2 would be moved to the y-position of #1 or smaller (because of upwards movement)
     * [#4 item]           it would replace it. then #2 would become #1 and the other way around.
     * todo to detect upwards or downwards movement: compare to first initialized y-position of grabbed element.
     *  if the new position is larger than the older position it's downwards movement.
     * todo if there was movement in any direction but on release the grabbed item is not enough to surpass any element
     *  it should just return to its original position.
     * todo after release while surpassing a todoItem they should in theory just need to switch places in the array
     *  and the instance had to be rerendered
     * todo dont forget localStorage
     */

    // WIP
    const holdItemHandler = (event: Event | MouseEvent) => {
        console.log("hold")
        if (event.type === 'mousedown') {
            isCurrentlyHoldingItem = true;
            heldGrabber = event.currentTarget as HTMLDivElement;
            if (heldGrabber){
                currentlyMovableTodo = heldGrabber.parentElement as HTMLDivElement;
                currentlyMovableTodoRect = currentlyMovableTodo.getBoundingClientRect();
                console.log("currentlyMovableItemRect", currentlyMovableTodoRect);
            }
            window.addEventListener('mousemove', determineNewPositionOfTodoAfterMoving)
        }
    }

    // WIP
    const releaseItemHandler = (event: Event | MouseEvent) => {
        console.log("release")
        if (heldGrabber && event.type === 'mouseup') {
            currentlyMovableTodo = heldGrabber.parentElement as HTMLDivElement;
            window.removeEventListener('mousemove', determineNewPositionOfTodoAfterMoving);
            currentlyMovableTodo.classList.remove('moving');
            heldGrabber = null;
            isCurrentlyHoldingItem = false;
        }
    }

    // WIP
    const determineNewPositionOfTodoAfterMoving = (event: Event | MouseEvent) => {
        if ("y" in event && heldGrabber && currentlyMovableTodo && currentlyMovableTodoRect) {
            const itemY = currentlyMovableTodoRect.y;
            const itemHeight = currentlyMovableTodoRect.height;
            const y = event.y;
            const pos = y - itemHeight + (itemHeight / 2) - itemY;

            // currentlyMovableItem.style.top = `${pos}px`;
            currentlyMovableTodo.classList.add('moving');
            currentlyMovableTodo.style.width = `${currentlyMovableTodoRect.width}px`;
            currentlyMovableTodo.style.top = `${y - (itemHeight / 2) - 16}px`;
            console.log(" ")
            console.log("top: ", `${y - (itemHeight / 2) - 16}px`)
            console.log(`${y} - ${itemHeight} + ${(itemHeight / 2)} - ${itemY} =`, pos)
            console.log(" ")

            // const initialPositionWhenGrabbed = 0;
            // const positionOfCursor = 0;
            // const halfHeightOfElement = 0;

            // console.log("positionOfTodos", positionOfTodos().map(pos => pos.element))
        }
    }

    const positionOfTodos = (): Record<string, number | Element>[] => {
        let positions: Record<string, number | Element>[] = [];

        todoDomElementList.forEach((todo, index) => {
            positions.push({
                index: index,
                y: todo.getBoundingClientRect().y,
                height: todo.getBoundingClientRect().height,
                width: todo.getBoundingClientRect().width,
                element: todo,
            })
        })

        return positions;
    }

    const handleMoveTodo = (event: Event) => {
        console.log("move")
        moveTodo(event);
        renderAllTodos(todoItems);
        setInteractionElements();
        setFontSizeForEachTodo(todoDomElementList, getDeviceOutput());

        // here all listeners for elements inside a todoElement have to be set again
        // because within the renderAllTodos function the innerHTML of the todolist ist emptied
        // which deletes all listeners as well
        assignBulkEventListeners(todoDoneCheckboxList, 'change', toggleTodoComplete);
        assignBulkEventListeners(deleteSingleTodoButtonList, 'click', handleDeleteTodo);
        assignBulkEventListeners(dragAndDropSortGrabberList, 'mousedown', holdItemHandler);
        assignBulkEventListeners(moveTodoInDirectionButtonList, 'click', handleMoveTodo);
        assignBulkEventListeners(todoTitleList, 'dblclick', handleEditTodoLabel);

        setDisabledSortButtons();
        setObjectInLocalStorage('todoItems', todoItems);
    }

    const moveTodo = (event: Event) => {
        const button = event.currentTarget as HTMLButtonElement;
        const buttonId = button.getAttribute('data-id');
        const todoItemToMove = todoItems.find(item => `${item.id}` === buttonId) as TodoItem;
        const indexOfTodoItemToMove = todoItems.indexOf(todoItemToMove);

        if (button.dataset.movetodoindirection === 'up')
            todoItems = swapArrayElementPositions(todoItems, indexOfTodoItemToMove, indexOfTodoItemToMove - 1);
        else if (button.dataset.movetodoindirection === 'down')
            todoItems = swapArrayElementPositions(todoItems, indexOfTodoItemToMove, indexOfTodoItemToMove + 1);
    }

    return { init };
}