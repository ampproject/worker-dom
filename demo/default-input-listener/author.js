const desc = document.createElement('p');
const input = document.createElement('input');
const valueOut = document.createElement('p');

desc.textContent = 'Worker Thread Implementation';
document.body.appendChild(desc);
document.body.appendChild(input);
document.body.appendChild(valueOut);

setInterval(_ => (valueOut.textContent = input.value), 500);
