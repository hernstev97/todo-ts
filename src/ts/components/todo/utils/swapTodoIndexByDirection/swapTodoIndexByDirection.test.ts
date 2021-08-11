import { swapTodoIndexByDirection } from "./swapTodoIndexByDirection";

const todoItemsUpResult = [
    {
        id: '2',
        title: 'Titel 2',
        completed: false,
    },
    {
        id: '1',
        title: 'Titel 1',
        completed: false,
    },
    {
        id: '3',
        title: 'Titel 3',
        completed: false,
    }
]

const todoItemsDownResult = [
    {
        id: '1',
        title: 'Titel 1',
        completed: false,
    },
    {
        id: '3',
        title: 'Titel 3',
        completed: false,
    },
    {
        id: '2',
        title: 'Titel 2',
        completed: false,
    }
]

describe('takes an array and returns it with two objects that are direct neighbours swapped', () => {
    test('swap with previous object', () => {
        const todoItems = [
            {
                id: '1',
                title: 'Titel 1',
                completed: false,
            },
            {
                id: '2',
                title: 'Titel 2',
                completed: false,
            },
            {
                id: '3',
                title: 'Titel 3',
                completed: false,
            }
        ]
        expect(swapTodoIndexByDirection(todoItems, 1, 'up')).toEqual(todoItemsUpResult)
    })

    test('swap with next object', () => {
        const todoItems = [
            {
                id: '1',
                title: 'Titel 1',
                completed: false,
            },
            {
                id: '2',
                title: 'Titel 2',
                completed: false,
            },
            {
                id: '3',
                title: 'Titel 3',
                completed: false,
            }
        ]
        expect(swapTodoIndexByDirection(todoItems, 1, 'down')).toEqual(todoItemsDownResult)
    })
})