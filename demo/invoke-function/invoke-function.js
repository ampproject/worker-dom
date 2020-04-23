function performComplexMath() {
  return 42;
}

function getRemoteData() {
  return Promise.resolve({ big: 'tuna' });
}

function immediatelyThrow() {
  throw new Error('Immediately threw');
}

function reject() {
  return Promise.reject('Unsupported operation: reject()');
}
