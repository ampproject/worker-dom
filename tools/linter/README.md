# @ampproject/worker-dom-linter

WorkerDOM supports most of DOM API transparently, but due to multi-threaded
environment, 100% support is not feasible. The `@ampproject/worker-dom-linter`
Babel plugin validates and reports APIs that are not implemented or implemented
differently in WorkerDOM.

See [WorkerDOM project](https://github.com/ampproject/worker-dom/) for context.

## Install

Using npm:

```sh
npm install --save-dev @ampproject/worker-dom-linter
```

or using yarn:

```sh
yarn add @ampproject/worker-dom-linter --dev
```

## Use in babel

Modify your .babelrc:

```
{
  "plugins": [
    ["@ampproject/worker-dom-linter", {}]
  ]
}
```

## False positives

This babel plugins doesn't have the complete typing information and thus cannot
ascertain whether a `x.offsetWidth` expression references `offsetWidth` property
of an `HTMLElement` instance or some unrelated object. Such false positives
can be ignored by adding `/*OK*/` comment, e.g. `x./*OK*/offsetWidth`.
