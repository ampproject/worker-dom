const span = document.createElement('span');
const div = document.createElement('div');
const input = document.createElement('input');
const button = document.createElement('button');

input.value = '';

function toggle() {
  span.classList.toggle('clicked');
  div.style.color = div.style.color === 'green' ? 'red' : 'green';
}

span.addEventListener('click', toggle, false);

button.addEventListener('click', (_) => (input.value = ''));

input.addEventListener(
  'input',
  (event) => {
    if (/change/.test(event.currentTarget.value)) {
      toggle();
    } else if (/remove/.test(event.currentTarget.value)) {
      span.remove();
    }
  },
  false,
);

button.appendChild(document.createTextNode('Reset Value'));
div.appendChild(document.createTextNode('Hello Originally Empty World!'));
span.appendChild(document.createTextNode('spaner'));
div.appendChild(span);
div.appendChild(input);
div.appendChild(button);
document.body.appendChild(div);

div.addEventListener('touchmove', (e) => console.log('touchmove event', e, e.touches.item(0), e.touches.item(1)));
