import { ready } from '@ampproject/worker-dom/dist/lib/worker.mjs';

async function run() {
  await ready;

  // dom mutation
  const el = document.createElement('h2');
  el.textContent = 'hello from worker';
  document.body.appendChild(el);

  // handler
  const button = document.querySelector('button');
  button.onclick = (ev) => {
    console.log('button:onclick', ev);
  };
}

run();
