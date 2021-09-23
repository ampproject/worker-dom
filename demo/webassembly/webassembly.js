const wasmModuleUrl = 'http://localhost:3001/webassembly/webassembly.wasm';
const importObject = {};
const wasmBrowserInstantiate = async () => {
  let response = undefined;

  // Here we are checking if streaming is
  // supported by the current browser. If not,
  // we fallback and instantiate manually.
  if (WebAssembly.instantiateStreaming) {
    response = await WebAssembly.instantiateStreaming(fetch(wasmModuleUrl), importObject);
  } else {
    const fetchAndInstantiateTask = async () => {
      const wasmArrayBuffer = await fetch(wasmModuleUrl).then((response) => response.arrayBuffer());
      return WebAssembly.instantiate(wasmArrayBuffer, importObject);
    };
    response = await fetchAndInstantiateTask();
  }

  return response;
};
const wasmModulePromise = wasmBrowserInstantiate();

const btn = document.getElementsByTagName('button')[0];
const aInput = document.getElementsByTagName('input')[0];
const bInput = document.getElementsByTagName('input')[1];
const result = document.getElementById('result');
const addValues = {
  a: 1,
  b: 1,
};

const inputHandler = (valueKey, event) => {
  addValues[valueKey] = parseInt(event.currentTarget.value, 10);
};

aInput.addEventListener('keyup', inputHandler.bind(undefined, 'a'));
bInput.addEventListener('keyup', inputHandler.bind(undefined, 'b'));

btn.addEventListener('click', async () => {
  wasmModulePromise.then((module) => {
    const wasmAdd = module.instance.exports.add(addValues.a, addValues.b);
    result.textContent = 'Result: ' + wasmAdd;
  });
});
