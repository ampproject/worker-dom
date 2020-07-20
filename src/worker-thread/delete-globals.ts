const ALLOWLISTED_GLOBALS: { [key: string]: boolean } = {
  Array: true,
  ArrayBuffer: true,
  BigInt: true,
  BigInt64Array: true,
  BigUint64Array: true,
  Boolean: true,
  Cache: true,
  CustomEvent: true,
  DataView: true,
  Date: true,
  Error: true,
  EvalError: true,
  Event: true,
  EventTarget: true,
  Float32Array: true,
  Float64Array: true,
  Function: true,
  Infinity: true,
  Int16Array: true,
  Int32Array: true,
  Int8Array: true,
  Intl: true,
  JSON: true,
  Map: true,
  Math: true,
  NaN: true,
  Number: true,
  Object: true,
  Promise: true,
  Proxy: true,
  RangeError: true,
  ReferenceError: true,
  Reflect: true,
  RegExp: true,
  Set: true,
  String: true,
  Symbol: true,
  SyntaxError: true,
  TextDecoder: true,
  TextEncoder: true,
  TypeError: true,
  URIError: true,
  URL: true,
  Uint16Array: true,
  Uint32Array: true,
  Uint8Array: true,
  Uint8ClampedArray: true,
  WeakMap: true,
  WeakSet: true,
  WebAssembly: true,
  WebSocket: true,
  XMLHttpRequest: true,
  atob: true,
  addEventListener: true,
  removeEventListener: true,
  btoa: true,
  caches: true,
  clearInterval: true,
  clearTimeout: true,
  console: true,
  decodeURI: true,
  decodeURIComponent: true,
  document: true,
  encodeURI: true,
  encodeURIComponent: true,
  escape: true,
  fetch: true,
  indexedDB: true,
  isFinite: true,
  isNaN: true,
  location: true,
  navigator: true,
  onerror: true,
  onrejectionhandled: true,
  onunhandledrejection: true,
  parseFloat: true,
  parseInt: true,
  performance: true,
  requestAnimationFrame: true,
  cancelAnimationFrame: true,
  self: true,
  setTimeout: true,
  setInterval: true,
  unescape: true,
};

// Modify global scope by removing disallowed properties.
export function deleteGlobals(global: WorkerGlobalScope) {
  /**
   * @param object
   * @param property
   * @return True if property was deleted from object. Otherwise, false.
   */
  const deleteUnsafe = (object: any, property: string): boolean => {
    if (!ALLOWLISTED_GLOBALS.hasOwnProperty(property)) {
      try {
        delete object[property];
        return true;
      } catch (e) {}
    }
    return false;
  };

  // Walk up global's prototype chain and dereference non-allowlisted properties
  // until EventTarget is reached.
  let current = global;
  while (current && current.constructor !== EventTarget) {
    const deleted: string[] = [];
    const failedToDelete: string[] = [];
    Object.getOwnPropertyNames(current).forEach((prop) => {
      if (deleteUnsafe(current, prop)) {
        deleted.push(prop);
      } else {
        failedToDelete.push(prop);
      }
    });
    console.info(`Removed ${deleted.length} references from`, current, ':', deleted);
    if (failedToDelete.length) {
      console.info(`Failed to remove ${failedToDelete.length} references from`, current, ':', failedToDelete);
    }
    current = Object.getPrototypeOf(current);
  }
}
