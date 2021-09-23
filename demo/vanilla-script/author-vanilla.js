const span = document.querySelector('span');
const div = document.querySelector('div');
const input = document.querySelector('input');

input.value = '';

function toggle() {
  span.classList.toggle('clicked');
  div.style.color = div.style.color === 'green' ? 'red' : 'green';
}

span.addEventListener('click', toggle, false);

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
