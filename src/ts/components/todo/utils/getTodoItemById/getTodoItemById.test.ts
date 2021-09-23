import { getTodoItemById } from "./getTodoItemById";
import TodoItem from "../../interfaces/TodoItem";

const list: TodoItem[] = [
    {
        id: 'uid#7XXQ1c5eO1',
        title: 'Test Title 1',
        completed: false
    },
    {
        id: 'uid#7XXQ1c5eO2',
        title: 'Test Title 2',
        completed: false
    },
    {
        id: 'uid#7XXQ1c5eO3',
        title: 'Test Title 3',
        completed: false
    }
];

const target: TodoItem = {
    id: 'uid#7XXQ1c5eO3',
    title: 'Test Title 3',
    completed: false
}

const targetId = 'uid#7XXQ1c5eO3';

describe('finds a todoItem that has the id attribute given in the function', () => {
    test('id and list given', () => {
        expect(getTodoItemById(list, targetId)).toEqual(target);
    })

    test('empty list given', () => {
        expect(getTodoItemById([], targetId)).toEqual(undefined);
    })

    test('no id given', () => {
        expect(getTodoItemById(list, '')).toEqual(undefined);
    })
});
