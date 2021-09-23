import { TodoEventTarget } from "../../interfaces/TodoEventTarget";
import addTodoElementToDom from "../todoDomElementGeneration/addElementToDom";
import {setTodoInteractions} from "./setTodoInteractions";

describe('sets several elements for interaction and returns them as an object', () => {
    const componentRoot = document.createElement('div');
    componentRoot.classList.add('todo-app');
    document.body.appendChild(componentRoot);

    const list = document.createElement('div');
    list.classList.add('todo-list');
    componentRoot.appendChild(list);

    const items = [
        {
            id: 'uid#18AEDLWMm3',
            title: '1',
            completed: false,
        },
        {
            id: 'uid#494Vn9Kj3p',
            title: '2',
            completed: false,
        }
    ]

    items.forEach(item => {
        addTodoElementToDom({
            id: item.id,
            title: item.title,
            completed: item.completed,
        })
    })
        
    let object: TodoEventTarget;
    if (componentRoot !== null)
        object = setTodoInteractions(componentRoot);

    test('doneCheckboxList', () => {
        expect(object.doneCheckboxList[0].dataset.todo).toEqual('todoCompletedCheckbox')
        expect(object.doneCheckboxList[1].dataset.todo).toEqual('todoCompletedCheckbox')
    });
    test('deleteButtonList', () => {
        expect(object.deleteButtonList[0].dataset.todo).toEqual('deleteSingleTodoButton')
        expect(object.deleteButtonList[1].dataset.todo).toEqual('deleteSingleTodoButton')
    });
    test('moveInDirectionButtonList', () => {
        expect(object.moveInDirectionButtonList[0].classList.value).toEqual('todo__move todo__move--up')
        expect(object.moveInDirectionButtonList[1].classList.value).toEqual('todo__move todo__move--down')
    });
    test('titleList', () => {
        expect(object.titleList[0].dataset.todo).toEqual('todoTitle')
        expect(object.titleList[1].dataset.todo).toEqual('todoTitle')
    });
});