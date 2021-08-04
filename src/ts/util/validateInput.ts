export default function validateInput(input: string): boolean {
    // for every test (every if-statement basically) increase this target value by 1
    const target = 2;
    let points = 0;

    if (input.length > 0) points++;
    if (input.replace(/\s/g, '').length) points++;

    return points === target;
}

module.exports = validateInput;