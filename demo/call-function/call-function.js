function performComplexMath() {
  return Math.random() * 1000;
}

function getRemoteData() {
  return Promise.resolve({ big: 'tuna' });
}

function immediatelyThrow() {
  throw new Error('Immediately threw');
}

function reject() {
  return Promise.reject('Unsupported operation.');
}

function returnsUndefined() {
  return Promise.resolve(undefined);
}

function add(n1, n2) {
  return n1 + n2;
}

function concat() {
  let combined = [];
  for (let i = 0; i < arguments.length; i++) {
    combined = combined.concat(arguments[i]);
  }
  return combined;
}

[performComplexMath, getRemoteData, immediatelyThrow, reject, add, concat, returnsUndefined].map((fn) => {
  exportFunction(fn.name, fn);
});

// Manual test for .onerror, by scheduling an unhandled error
// 2s in via prompt which isn't valid in a Worker.
setTimeout(() => prompt(), 2000);
