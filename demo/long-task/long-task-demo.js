const btn = document.getElementsByTagName('button')[0];

btn.addEventListener('click', (_) => {
  fetch('http://localhost:3001/slow/long-task/data.json')
    .then((response) => response.json())
    .then((json) => {
      const h1 = document.createElement('h1');
      h1.textContent = 'Hello ' + json.year + ' World!';
      document.body.appendChild(h1);
    });
});
