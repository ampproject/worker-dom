const el = document.querySelector('div');
const comment = document.body.firstChild;

const replacer = document.createElement('p');
replacer.appendChild(document.createTextNode('replacer'));

let replaced = false;
el.addEventListener('click', function() {
  if (!replaced) {
    document.body.replaceChild(replacer, comment);
    replaced = true;
  } else {
    document.body.replaceChild(comment, replacer);
    replaced = false;
  }
});
