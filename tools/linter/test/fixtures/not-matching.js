// String literal.
'pageXOffset';
// Implicit global assignment, not read.
pageXOffset = x;
// Unrelated object declaration.
x = { pageXOffset: 1 };
// Unrelated property read.
offsetWidth.other;
// Unrelated method call.
getBoundingClientRect.other();
// Unrelated property read.
btn.other;
// Unrelated property read by key.
btn['other'];
// Unrelated property array access.
btn[1];
function one(pageXOffset) {
  // Local shadow for an implicit global.
  pageXOffset;
}
function two(getComputedStyle) {
  // Local shadow for an implicit global.
  getComputedStyle();
}
function three(other) {
  // Local shadow for an implicit global.
  var pageXOffset = other;
  pageXOffset;
}
function four(offsetWidth) {
  // A computed property access.
  btn[offsetWidth];
}
function five(btn, offsetWidth) {
  var { [offsetWidth]: x } = btn;
}
