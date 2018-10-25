const comment = document.createComment('Test');
const el = document.createElement('div');

el.appendChild(document.createTextNode('bar'));
el.classList.add('foo');
document.body.appendChild(comment);
document.body.appendChild(el);

let replaced = false;
el.addEventListener('click', function() {
  if (!replaced) {
    const replacer = document.createElement('p');
    replacer.appendChild(document.createTextNode('replacer'));

    document.body.replaceChild(replacer, comment);
    replaced = true;
  } else {
    document.body.replaceChild(comment, document.body.getElementsByTagName('p')[0]);
    replaced = false;
  }
});