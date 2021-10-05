import { getIdOfCurrentTarget } from "./getIdOfCurrentTarget";
import getUniqueId from "../../../../../util/uniqueId/uniqueId";

const target = document.createElement('div');
target.setAttribute('data-id', getUniqueId())

const eventName = {
    currentTarget: target as EventTarget,
} as CustomEvent

test('finds the id of the current eventtarget', () => {
    expect(getIdOfCurrentTarget(eventName)).toMatch(/uid#[a-zA-Z0-9]*/i)
})