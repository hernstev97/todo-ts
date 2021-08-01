import TodoItem from "../../interfaces/TodoItem";
import allItemsRemoveButtonVisibilityHandler from "../../util/allItemsRemoveButtonVisibilityHandler";
import { assignBulkEventListeners } from "../../util/eventListeners";
import setFontSizeForEachTodo from "../../util/setFontSizeForEachTodo";
import { getDeviceOutput } from "../../util/getDeviceOutput";
import { getObjectInLocalStorage, setObjectInLocalStorage } from "../../util/setObjectInLocalStorage";
import addTodoElementToDom from "../../util/addElementToDom";
import { setDisabledAttribute, removeDisabledAttribute } from "../../util/setDisabledAttribute";
import { swapArrayElementPositions } from "../../util/swapArrayElementPositions";
import {TodoPosition} from "../../interfaces/TodoPosition";

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
    let currentlyMovableTodo: HTMLElement | null | undefined;
    let currentlyMovableTodoRect: DOMRect | null;
    let positionOfTodosWhenGrabbed: TodoPosition[];
    let initialGrabbedTodoPosition: TodoPosition | undefined;
    let hasSurpassedOtherPositions: boolean;
    let surpassedTodo: TodoPosition | undefined;
    let yPositionsOfTodosInAttemptedDirection: number[];
    let placeholder: Node | null; // todo ?rename
    let surpassed: Element | undefined; // todo ?rename
    let removed: Node | null; // todo ?rename
    let indexOfSurpassedTodo: number;

    const init = () => {
        buildTodosFromLocalStorage();
        setInteractionElements();
        allItemsRemoveButtonVisibilityHandler(todoItems, removeAllItemsButton);
        setDisabledSortButtons();
        bindEvents();
        setFontSizeForEachTodo(todoDomElementList, getDeviceOutput());
    }

    const bindEvents = () => {
        addTodoTextInput.addEventListener( 'input', setInputState)

        addTodoFormElement.addEventListener('submit', handleFormSubmit)

        removeAllItemsButton.addEventListener('click', handleDeleteAllTodos)

        window.addEventListener( 'mouseup', releaseItemHandler)
        window.addEventListener( 'touchend', releaseItemHandler)

        assignBulkEventListeners(todoDoneCheckboxList, 'change', toggleTodoComplete);

        assignBulkEventListeners(deleteSingleTodoButtonList, 'click', handleDeleteTodo)

        assignBulkEventListeners(dragAndDropSortGrabberList, 'mousedown', holdItemHandler)
        assignBulkEventListeners(dragAndDropSortGrabberList, 'touchstart', holdItemHandler)

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
        dragAndDropSortGrabberList[indexForNewItem].addEventListener('touchstart', holdItemHandler)
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
    /* get position of all todos while grabbing
     * delete positions after releasing grab
     * todo set newPosition via the calculated position minus its original position as it was grabbed
     * if y-position of currently held item is >= OR <= any item it takes its position, depending on movement up or down
     * get all todoElements
     *      split the array by the currently held todoElement
     * get all the ids of the elements preceeding the grabbed element in one array
     *  and the elements following in another element
     *  then compare preceeding elements on upwards movement and following elements on downwards movement
     * [#1 item]
     * [#2 movingItem] <-- this will not take the position of #1 just because it is beyond the y-position of #1.
     * [#3 item]           only if #2 would be moved to the y-position of #1 or smaller (because of upwards movement)
     * [#4 item]           it would replace it. then #2 would become #1 and the other way around.
     * to detect upwards or downwards movement: compare to first initialized y-position of grabbed element.
     *  if the new position is larger than the older position it's downwards movement.
     * todo if there was movement in any direction but on release the grabbed item is not enough to surpass any element
     *  it should just return to its original position.
     * todo after release while surpassing a todoItem they should in theory just need to switch places in the array
     *  and the instance had to be rerendered
     * todo dont forget localStorage
     */

    // WIP
    const holdItemHandler = (event: Event | MouseEvent | TouchEvent) => {
        if (event.type === 'mousedown' || event.type === 'touchstart') {
            const scrollY = window.scrollY;
            isCurrentlyHoldingItem = true;
            currentlyMovableTodo = (event.currentTarget as HTMLDivElement)?.parentElement;
            positionOfTodosWhenGrabbed = positionOfTodos();

            if (currentlyMovableTodo){
                console.log("todoDomElementList", todoDomElementList)
                console.log("currentlyMovableTodo", currentlyMovableTodo)
                currentlyMovableTodoRect = currentlyMovableTodo.getBoundingClientRect();
                initialGrabbedTodoPosition = positionOfTodosWhenGrabbed.find(todo => {
                    return todo.id === Number(currentlyMovableTodo?.getAttribute('data-id'));
                });

                console.log("initialGrabbedTodoPosition", initialGrabbedTodoPosition)
                if (initialGrabbedTodoPosition) {
                    currentlyMovableTodo.classList.add('moving');
                    currentlyMovableTodo.style.width = `${currentlyMovableTodoRect.width}px`;
                    currentlyMovableTodo.style.top = `${initialGrabbedTodoPosition.y - 16}px`;
                    currentlyMovableTodo.insertAdjacentHTML(
                        'beforebegin',
                        createPlaceholderForGrabbedElement(
                            initialGrabbedTodoPosition.y,
                            initialGrabbedTodoPosition.width,
                            initialGrabbedTodoPosition.height
                        )
                    );
                }
            }
            window.addEventListener('mousemove', determineNewPositionOfTodoAfterMoving)
        }
    }

    // WIP
    const releaseItemHandler = (event: Event | MouseEvent | TouchEvent) => {
        if (currentlyMovableTodo && (event.type === 'mouseup' || event.type === 'touchend')) {
            if (hasSurpassedOtherPositions) {
                if (surpassedTodo) {
                    // todo this can be a function
                    surpassed = todoElementNodeList[surpassedTodo.index]
                    indexOfSurpassedTodo = Array.from(todoElementNodeList).indexOf(surpassed);
                    removed = todoList.removeChild(currentlyMovableTodo);
                    // const index = Array.from(todoElementNodeList).indexOf(currentlyMovableTodo)
                    // todo also needs a insertbefore in some cases

                    // todo in the ui i move the element up or down. however in the array two elements switch position
                    /* TODO Split the array at the index of the new position
                    *   remove the moved todoItem from the array
                    *   add it to the end of the first array.
                    *   1. [t, t, t, mt, t]
                    *   2. [t, t] new position [t, mt, t]
                    *   3. [t, t] new position [t, t]
                    *   4. [t, t, mt] [t, t]
                    *   5. [t, t, mt, t, t]
                    * */
                    let moveThis = Array.from(todoItems).splice((initialGrabbedTodoPosition as TodoPosition).index, 1);
                    const back = Array.from(todoItems);
                    const front = back.splice(0, indexOfSurpassedTodo);

                    const useFirstArray = front.some(todoItem => todoItem.id === (initialGrabbedTodoPosition as TodoPosition).id)

                    console.log("indexOfSurpassedTodo", indexOfSurpassedTodo)
                    console.log("useFirstArray", useFirstArray)
                    console.log("moveThis", moveThis)
                    console.log("back", back)
                    console.log("front", front)
                    if (indexOfSurpassedTodo === 0)
                        todoItems = [...moveThis, ...back]
                    if (indexOfSurpassedTodo === todoItems.length - 1)
                        todoItems = [...front, ...moveThis]
                    else {
                        useFirstArray ? front.pop() : back.shift();
                        todoItems = [...front, ...moveThis, ...back]
                    }

                    console.log("todoItems", todoItems)


                    if (indexOfSurpassedTodo === 0) todoList.insertBefore(removed, surpassed);
                    else insertAfter(removed, surpassed)

                    // todoItems = swapArrayElementPositions(todoItems, surpassedTodo.index, index);
                    setObjectInLocalStorage('todoItems', todoItems);
                }
                // todo test if rerendering has to be done. if so: try new method
            }
            placeholder = componentRoot.querySelector('[data-todo="placeholder"]') as Node;
            (todoList as Node).removeChild(placeholder);
            currentlyMovableTodo.style.width = '';
            currentlyMovableTodo.style.top = '';
            window.removeEventListener('mousemove', determineNewPositionOfTodoAfterMoving);
            window.removeEventListener('touchmove', determineNewPositionOfTodoAfterMoving);
            currentlyMovableTodo.classList.remove('moving');

            isCurrentlyHoldingItem = false;
            positionOfTodosWhenGrabbed = [];
        }
    }

    // todo rename
    const func = (movesUp: boolean, idArray: number[], position: number) => { // todo rename position
        const todosBeforeOrAfterGrabbedElement = positionOfTodosWhenGrabbed.filter(todo => todo.id === idArray.find(p => p === todo.id));
        const todosInAttemptedDirection = todosBeforeOrAfterGrabbedElement.filter(todo => {
            if (todo.id !== Number(currentlyMovableTodo?.getAttribute('data-id')))
                return todo;
        });
        yPositionsOfTodosInAttemptedDirection = todosInAttemptedDirection.map(todo => todo.y);

        hasSurpassedOtherPositions = yPositionsOfTodosInAttemptedDirection.some((yPosition, index) => {
            if (movesUp)
                return (yPosition + (todosInAttemptedDirection[index].height) - 16) > position

            return (yPosition - 16) < position
        });
    }

    // todo refactor / rename variables / create functions where possible
    const determineNewPositionOfTodoAfterMoving = (event: Event | MouseEvent | TouchEvent) => {
        if ("y" in event && currentlyMovableTodo && currentlyMovableTodoRect) {
            const itemHeight = currentlyMovableTodoRect.height;
            const cursorYPosition = event.y;
            const pos = cursorYPosition - (itemHeight / 2) + window.scrollY; // todo rename

            if (initialGrabbedTodoPosition) {
                const initialGrabbedTodoY = initialGrabbedTodoPosition.y
                const todoElements = Array.from(todoElementNodeList);
                const indexOfMovingTodoWithinAllTodos = todoElements.indexOf(currentlyMovableTodo) // todo rename
                const idsBeforeMovingTodo = todoElements.slice(0, indexOfMovingTodoWithinAllTodos).map(p => Number(p.getAttribute('data-id'))) // todo rename
                const idsAfterMovingTodo = todoElements.slice(indexOfMovingTodoWithinAllTodos+1).map(p => Number(p.getAttribute('data-id'))) // todo rename
                const isMovingUp = initialGrabbedTodoY > (cursorYPosition - (currentlyMovableTodoRect.height / 2));

                if (isMovingUp)
                    func(isMovingUp, idsBeforeMovingTodo, pos);
                else
                    func(isMovingUp, idsAfterMovingTodo, pos);

                if (hasSurpassedOtherPositions) {
                    let closest = yPositionsOfTodosInAttemptedDirection.reduce(function(prev, curr) {
                        return (Math.abs(curr - pos) < Math.abs(prev - pos) ? curr : prev);
                    });
                    surpassedTodo = positionOfTodosWhenGrabbed.find(todo => todo.y === closest)

                    if (surpassedTodo) {
                        // todo this can be a function
                        placeholder = componentRoot.querySelector('[data-todo="placeholder"]') as Node;
                        surpassed = todoElementNodeList[surpassedTodo.index]
                        removed = (todoList as Node).removeChild(placeholder);
                        indexOfSurpassedTodo = Array.from(todoElementNodeList).indexOf(surpassed);
                        if (isMovingUp) todoList.insertBefore(removed, surpassed);
                        else insertAfter(removed, surpassed)
                    }
                } else if (placeholder && surpassed && removed) {
                    if (indexOfSurpassedTodo === 0) todoList.insertBefore(surpassed, removed);
                    else insertAfter(surpassed, removed)
                }

                currentlyMovableTodo.style.width = `${currentlyMovableTodoRect.width}px`;
                currentlyMovableTodo.style.top = `${pos}px`;
            }
        }
    }

    const createPlaceholderForGrabbedElement = (top: number, width: number, height: number) => {
        return `<div 
                    data-todo="placeholder"
                    style="position: relative;
                    top: ${top}px;
                    width: ${width}px;
                    height: ${height}px;" 
                />`;
    }

    const positionOfTodos = (): TodoPosition[] => {
        let positions: TodoPosition[] = [];

        todoDomElementList.forEach((todo, index) => {
            positions.push({
                index: index,
                id: Number(todo.getAttribute('data-id')),
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
        assignBulkEventListeners(dragAndDropSortGrabberList, 'touchstart', holdItemHandler);
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