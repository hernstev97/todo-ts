import './css/style.pcss';
import { todo } from "./ts/components/todo/Todo";

const { init } = todo();

init();

// maybe create a fake state with a list of all todoItems?

// edit
// dblclick on text
// remove text and place input.pcss field with same value
// get the value from the input.pcss field via onchange event
// on submit fill component with new text value

// sort
// use array function

// drag & drop
// click and hold & only works while holding
// safe initial position of element while holding
// get target element via event
// creates placeholder element at exact coordinates
// dragged element follows cursor from center of element
// only y axis