/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
      const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response => response.arrayBuffer());
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
  wasmModulePromise.then(module => {
    const wasmAdd = module.instance.exports.add(addValues.a, addValues.b);
    result.textContent = 'Result: ' + wasmAdd;
  });
});
