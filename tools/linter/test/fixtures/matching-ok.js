// Implicit global reference.
/*OK*/ pageXOffset;
// Implicit global reference.
x = /*OK*/ pageXOffset;
// Implicit global reference.
x = /*OK*/ pageXOffset + 10;
// Implicit global reference.
x(/*OK*/ pageXOffset);
// Explicit global reference.
window./*OK*/ pageXOffset;
// Property getter.
btn./*OK*/ offsetWidth;
// Property getter by key.
btn[/*OK*/ 'offsetWidth'];
// Property getter by key.
btn /*OK*/['offsetWidth'];
// Method call.
bth./*OK*/ getBoundingClientRect();
// Method call by key.
bth[/*OK*/ 'getBoundingClientRect']();
// Method call by key.
bth /*OK*/['getBoundingClientRect']();
// Implicit global method call.
/*OK*/ getComputedStyle();
// Implicit global method call.
/*OK*/ getComputedStyle(btn);
// Explicit global method call.
window./*OK*/ getComputedStyle(btn);
// Implicit global reference.
if (/*OK*/ pageXOffset) {
}
function one(btn) {
  // Property access via object destructuring.
  var { /*OK*/ offsetWidth } = btn;
  offsetWidth;
}
function two(btn) {
  // Property access via object destructuring.
  var { /*OK*/ offsetWidth: x } = btn;
}
