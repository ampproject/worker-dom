exportFunction('getData', () => ({ data: 42 }));

const btn = document.getElementsByTagName('button')[0];

btn.addEventListener('click', async () => {
  const h1 = document.createElement('h1');
  h1.textContent = 'Hello World!';
  document.body.appendChild(h1);

  const boundingClientRect = await h1.getBoundingClientRectAsync();
  h1.textContent = h1.textContent + JSON.stringify(boundingClientRect);
});

requestAnimationFrame(() => console.log('animation'));
