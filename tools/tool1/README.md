# @ampproject/worker-dom-tools-tool1

TODO: tool1

See [WorkerDOM project](https://github.com/ampproject/worker-dom/) for context.

## Install

Using npm:

```sh
npm install --save-dev @ampproject/worker-dom-tools-tool1
```

or using yarn:

```sh
yarn add @ampproject/worker-dom-tools-tool1 --dev
```

## Use in babel

Modify your .babelrc:

```
{
  "plugins": [
    ["@ampproject/worker-dom-tools-tool1", {}]
  ]
}
```

## False positives

This babel plugins doesn't have the complete typing information and thus cannot
ascertain whether a `x.offsetWidth` expression references `offsetWidth` property
of an `HTMLElement` instance or some unrelated object. Such false positives
can be ignored by adding `/*OK*/` comment, e.g. `x./*OK*/offsetWidth`.
