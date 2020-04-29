# worker-dom as package with webpack

## Webpack settings

- Add `@ampproject/worker-dom`
- Add `worker-plugin` or `worker-loader` to create worker on webpack

In this README, we use `worker-plugin`.

```js
// webpack.config.js
const WorkerPlugin = require("worker-plugin");
module.exports = {
  // ...
  plugins: [new WorkerPlugin()]
}
```

## Example

```js
// worker.js
import { ready } from "@ampproject/worker-dom/dist/lib/worker";

ready.then(() =>{ 
  document.body.firstChild.textContent = 'hello from worker mutate';
});
```

```js
// main.js
import { attachWorker } from "@ampproject/worker-dom/dist/lib/main";

// Create worker by your own way
// This code uses worker-plugin
const worker = new Worker("./worker.js", { type: "module" });

// attach worker to dom
attachWorker(document.querySelector('#root'), worker);
```

