const btn = document.getElementsByTagName('button')[0];

btn.addEventListener('click', async () => {
  const style = document.createElement('style');
  style.textContent = `* { color: red !important }`;
  document.body.appendChild(style);
});
