const componentRootElement = document.createElement('div');
componentRootElement.setAttribute('data-component', 'todo')
document.appendChild(componentRootElement);

const initial: string =
    `
    <div data-component="todo">
        <div data-todo="todoItem" class="todo " data-id="uid#7XXQ1c5eO1">
            <div class="todo__interaction-wrapper">
                <button class="todo__move todo__move--up" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="up">
                    <span></span>
                </button>
                <button class="todo__move todo__move--down" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="down">
                    <span></span>
                </button>
            </div>
        </div>
        <div data-todo="todoItem" class="todo " data-id="uid#7XXQ1c5eO1">
            <div class="todo__interaction-wrapper">
                <button class="todo__move todo__move--up" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="up">
                    <span></span>
                </button>
                <button class="todo__move todo__move--down" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="down">
                    <span></span>
                </button>
            </div>
        </div>
        <div data-todo="todoItem" class="todo " data-id="uid#7XXQ1c5eO1">
            <div class="todo__interaction-wrapper">
                <button class="todo__move todo__move--up" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="up">
                    <span></span>
                </button>
                <button class="todo__move todo__move--down" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="down">
                    <span></span>
                </button>
            </div>
        </div>
    </div>
    `

const result: string =
    `
    <div data-component="todo">
        <div data-todo="todoItem" class="todo " data-id="uid#7XXQ1c5eO1">
            <div class="todo__interaction-wrapper">
                <button class="todo__move todo__move--up" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="up" disabled>
                    <span></span>
                </button>
                <button class="todo__move todo__move--down" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="down">
                    <span></span>
                </button>
            </div>
        </div>
        <div data-todo="todoItem" class="todo " data-id="uid#7XXQ1c5eO1">
            <div class="todo__interaction-wrapper">
                <button class="todo__move todo__move--up" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="up">
                    <span></span>
                </button>
                <button class="todo__move todo__move--down" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="down">
                    <span></span>
                </button>
            </div>
        </div>
        <div data-todo="todoItem" class="todo " data-id="uid#7XXQ1c5eO1">
            <div class="todo__interaction-wrapper">
                <button class="todo__move todo__move--up" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="up">
                    <span></span>
                </button>
                <button class="todo__move todo__move--down" data-id="uid#7XXQ1c5eO1" data-movetodoindirection="down" disabled>
                    <span></span>
                </button>
            </div>
        </div>
    </div>
    `

test('sets the first and last of all sort buttons as disabled', () => {
    const componentRoot = document.querySelector('[data-component="todo"]') as HTMLElement;
    // expect()
})