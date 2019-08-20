document.getElementById('clone').addEventListener('click', () => {
  const cloned = document.querySelector('p').cloneNode(true);
  document.body.appendChild(cloned);
});
