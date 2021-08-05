import swapArrayElementPositions from "../src/ts/util/swapArrayElementPositions";

test('takes an array and switches two given indexes', () => {
    expect(swapArrayElementPositions([0, 1, 2, 3], 1, 3)).toEqual([0, 3, 2, 1]);
});