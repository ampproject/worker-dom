# WorkerDOM

An in-progress implementation of the DOM API intended to run within a Web Worker. 

**Purpose**: Move complexity of intermediate work related to DOM mutations to a background thread, sending only the necessary manipulations to a foreground thread.

**Use Cases**:
1. Embedded content from a third party living side by side with first party code.
2. Mitigation of expensive rendering for content not requiring synchronous updates to user actions.
3. Retaining main thread availablity for high priority updates by async updating elsewhere in a document.

For more information, visit our [blog post](https://bit.ly/worker-dom-blog) announcing WorkerDOM or checkout the [slides](https://bit.ly/worker-dom-slides) from the announcement at JSConf US.

## Installation

```bash
npm install @ampproject/worker-dom
```

## Usage

WorkerDOM comes in two flavours, a global variant and a module variant. It is possible to include the WorkerDOM main thread code within your document directly or via a bundler. Here's how you might do so directly:

```html
<script src="path/to/workerdom/dist/index.mjs" type="module"></script>
<script src="path/to/workerdom/dist/index.js" nomodule defer></script>
```

WorkerDOM allows us to upgrade a specific section of the document to be driven by a worker. For example, imagine a `div` node in the page like so:

```html
<div src="hello-world.js" id="upgrade-me"></div>
```

To upgrade this node using the module version of the code, we can directly import `upgradeElement` and use it like this:

```html
<script type="module">
  import {upgradeElement} from './dist/index.mjs';
  upgradeElement(document.getElementById('upgrade-me'), './dist/worker.mjs');
</script>
```

The nomodule format exposes the global `MainThread`, and could upgrade the `div` in the following way:

```html
<script nomodule async=false defer>
  document.addEventListener('DOMContentLoaded', function() {
    MainThread.upgradeElement(document.getElementById('upgrade-me'), './dist/worker.js');
  }, false);
</script>
``` 

### "Safe" mode

WorkerDOM has a special output variant that includes safety features e.g. HTML sanitization and a web worker sandbox. This variant is distributed under the ".safe" suffix for main and worker thread binaries:

```
index.safe.mjs
index.safe.js

worker.safe.mjs
worker.safe.js
```

## Running Demos Locally

After cloning the repository, you can try out the debug demos with the following.

```bash
npm run demo
```

This script will build the current version of WorkerDOM and start up a local [webserver](http://localhost:3001).

## Security disclosures

The AMP Project accepts responsible security disclosures through the [Google Application Security program](https://www.google.com/about/appsecurity/).

## Code of conduct

The AMP Project strives for a positive and growing project community that provides a safe environment for everyone.  All members, committers and volunteers in the community are required to act according to the [code of conduct](CODE_OF_CONDUCT.md).

## License

worker-dom is licensed under the [Apache License, Version 2.0](LICENSE).
