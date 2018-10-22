const comment = document.createComment('Test');
const el = document.createElement('div');
const replacer = document.createElement('p');

replacer.appendChild(document.createTextNode('replacer'));
el.appendChild(document.createTextNode('bar'));
el.classList.add('foo');
document.body.appendChild(comment);
document.body.appendChild(el);

let replaced = false;
el.addEventListener('click', function() {
  if (!replaced) {
    document.body.replaceChild(replacer, comment);
    replaced = true;
  }
});