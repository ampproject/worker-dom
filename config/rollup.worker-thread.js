/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
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

import replace from '@rollup/plugin-replace';
import { babelPlugin } from './rollup.plugins.js';

// Workers do not natively support ES Modules containing `import` or `export` statments.
// So, here we continue to use the '.mjs' extension to indicate newer ECMASCRIPT support
// but ensure the code can be run within a worker by putting it inside a named iife.
const ESModules = [
  {
    input: 'output/worker-thread/index.js',
    output: {
      file: 'dist/worker/worker.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        WORKER_DOM_DEBUG: false,
      }),
      babelPlugin({
        allowConsole: false,
      }),
    ],
  },
  {
    input: 'output/worker-thread/index.js',
    output: {
      file: 'dist/debug/worker/worker.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        WORKER_DOM_DEBUG: true,
      }),
      babelPlugin({
        allowConsole: true,
      }),
    ],
  },
  {
    input: 'output/worker-thread/index.amp.js',
    output: {
      file: 'dist/amp-production/worker/worker.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        WORKER_DOM_DEBUG: false,
      }),
      babelPlugin({
        allowConsole: false,
      }),
    ],
  },
  {
    input: 'output/worker-thread/index.amp.js',
    output: {
      file: 'dist/amp-debug/worker/worker.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      babelPlugin({
        allowConsole: true,
      }),
    ],
  },
  {
    input: 'output/worker-thread/index.nodom.amp.js',
    output: {
      file: 'dist/amp-production/worker/worker.nodom.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        WORKER_DOM_DEBUG: false,
      }),
      babelPlugin({
        allowConsole: true,
      }),
    ],
  },
  {
    input: 'output/worker-thread/index.nodom.amp.js',
    output: {
      file: 'dist/amp-debug/worker/worker.nodom.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        WORKER_DOM_DEBUG: true,
      }),
      babelPlugin({
        allowConsole: true,
      }),
    ],
  },
];

export default [...ESModules];
