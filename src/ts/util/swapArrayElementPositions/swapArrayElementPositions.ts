export default function swapArrayElementPositions <T>(array: T[], indexA: number, indexB: number): T[] {
    let temp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = temp;

    return array;
}