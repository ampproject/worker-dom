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
