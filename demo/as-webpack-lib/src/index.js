import { attachWorker } from '@ampproject/worker-dom/dist/lib/main.mjs';

const el = document.createElement('main');
el.innerHTML = `
<div>
  <h1>main</h1>
  <button>click</button>
</div>
`;
document.body.appendChild(el);

const worker = new Worker('./worker.js', { type: 'module' });

attachWorker(el, worker);
