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

import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
import copy from 'rollup-plugin-copy';
import { babelPlugin } from './rollup.plugins.js';

// Compile plugins should always be added at the end of the plugin list.
const compilePlugins = [
  compiler({
    env: 'CUSTOM',
  }),
  terser(),
];

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
      copy({
        targets: [
          {
            src: 'config/dist-packaging/worker/package.json',
            dest: 'dist/worker',
          },
        ],
      }),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: false,
      }),
      ...compilePlugins,
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
      copy({
        targets: [
          {
            src: 'config/dist-packaging/debug/worker/package.json',
            dest: 'dist/debug/worker',
          },
        ],
      }),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: false,
      }),
    ],
  },
  {
    input: 'output/worker-thread/index.amp.js',
    output: {
      file: 'dist/amp/worker/worker.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      copy({
        targets: [
          {
            src: 'config/dist-packaging/amp/worker/package.json',
            dest: 'dist/amp/worker',
          },
        ],
      }),
      replace({
        DEBUG_ENABLED: true,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: true,
      }),
    ],
  },
  {
    input: 'output/worker-thread/index.amp.js',
    output: {
      file: 'dist/amp/worker/worker.js',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      copy({
        targets: [
          {
            src: 'config/dist-packaging/amp/worker/package.json',
            dest: 'dist/amp/worker',
          },
        ],
      }),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: false,
      }),
      ...compilePlugins,
    ],
  },
];

const IIFEModules = [
  {
    input: 'output/worker-thread/index.js',
    output: {
      file: 'dist/worker/worker.js',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: false,
      }),
      ...compilePlugins,
    ],
  },
  {
    input: 'output/worker-thread/index.js',
    output: {
      file: 'dist/debug/worker/worker.js',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        DEBUG_ENABLED: true,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: true,
      }),
    ],
  },
];

export default [...ESModules, ...IIFEModules];
