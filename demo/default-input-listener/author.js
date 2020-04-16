const defaultInput = document.getElementById('default-syntax-input');
const defaultOut = document.getElementById('default-syntax-output');

setInterval((_) => (defaultOut.textContent = defaultInput.value), 500);

const desc = document.createElement('p');
const input = document.createElement('input');
const valueOut = document.createElement('p');

desc.textContent = 'Worker Thread Implementation, Generated Nodes';
document.body.appendChild(desc);
document.body.appendChild(input);
document.body.appendChild(valueOut);

setInterval((_) => (valueOut.textContent = input.value), 500);
