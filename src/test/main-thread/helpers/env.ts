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

import { JSDOM } from 'jsdom';

export class Env {
  jsdom: JSDOM;
  document: Document;
  window: Window;
  workers: Array<WorkerImpl>;
  rafTasks: Array<Function>;

  constructor() {
    // JSDOM document URL necessary for localStorage access.
    this.jsdom = new JSDOM('<!DOCTYPE html>', { url: 'http://localhost:3001' });
    this.document = this.jsdom.window.document;
    this.window = this.jsdom.window;

    const workers: Array<WorkerImpl> = (this.workers = []);
    Object.defineProperty(global, 'Worker', {
      configurable: true,
      value: function(url: string, options: any = {}) {
        const worker = new WorkerImpl(url, options);
        workers.push(worker);
        return worker;
      },
    });

    Object.defineProperty(global, 'Blob', {
      configurable: true,
      value: BlobImpl,
    });
    if (!(global as any)['URL']) {
      const URL = function() {};
      Object.defineProperty(global, 'URL', {
        configurable: true,
        value: URL,
      });
    }
    Object.defineProperty((global as any)['URL'], 'createObjectURL', {
      configurable: true,
      value: function(obj: any) {
        return obj.toString();
      },
    });

    const rafTasks: Array<Function> = (this.rafTasks = []);
    const requestAnimationFrame = (callback: Function) => {
      rafTasks.push(callback);
      return 1;
    };
    Object.defineProperty(global, 'requestAnimationFrame', {
      configurable: true,
      value: requestAnimationFrame,
    });

    Object.defineProperty(global, 'DEBUG_ENABLED', {
      configurable: true,
      value: false,
    });

    Object.defineProperty(global, 'window', {
      configurable: true,
      value: this.window,
    });
  }

  dispose() {
    Object.defineProperty(global, 'Worker', {
      configurable: true,
      value: null,
    });
    Object.defineProperty(global, 'Blob', {
      configurable: true,
      value: null,
    });
    Object.defineProperty((global as any)['URL'], 'createObjectURL', {
      configurable: true,
      value: null,
    });
    Object.defineProperty(global, 'requestAnimationFrame', {
      configurable: true,
      value: null,
    });
  }
}

/**
 * See https://developer.mozilla.org/en-US/docs/Web/API/Worker
 */
export class WorkerImpl {
  url: string;
  options: any;
  terminated: boolean;
  onmessage: Function;

  constructor(url: string, options: any = {}) {
    this.url = url;
    this.options = options;
    this.terminated = false;
  }

  postMessage(message: any, transfer = []) {}

  terminate() {
    this.terminated = true;
  }
}

export class BlobImpl {
  parts: Array<string>;
  options: any;

  constructor(parts: Array<string>, options: any = {}) {
    this.parts = parts;
    this.options = options;
  }

  toString() {
    return 'BLOB:' + this.parts.join(',');
  }
}
