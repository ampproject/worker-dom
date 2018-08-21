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
import {babelPlugin, removeTestingDocument} from './rollup.plugins.js';
import {MINIFY_BUNDLE_VALUE, DEBUG_BUNDLE_VALUE} from './rollup.utils.js';

// Workers do not natively support ES Modules containing `import` or `export` statments.
// So, here we continue to use the '.mjs' extension to indicate newer ECMASCRIPT support
// but ensure the code can be run within a worker by putting it inside a named iife.
const ESModules = [
  {
    input: 'output/worker-thread/index.js',
    output: {
      file: 'dist/worker.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      removeTestingDocument(),
      babelPlugin({
        transpileToES5: false,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
      MINIFY_BUNDLE_VALUE ? compiler({
        env: 'CUSTOM'
      }) : null,
    ].filter(Boolean)
  },
  {
    input: 'output/worker-thread/index.safe.js',
    output: {
      file: 'dist/worker.safe.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      removeTestingDocument(),
      babelPlugin({
        transpileToES5: false,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
      MINIFY_BUNDLE_VALUE ? compiler({
        env: 'CUSTOM'
      }) : null,
    ].filter(Boolean)
  },
];

const IIFEModules = [
  {
    input: 'output/worker-thread/index.js',
    output: {
      file: 'dist/worker.js',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      removeTestingDocument(),
      babelPlugin({
        transpileToES5: true,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
      MINIFY_BUNDLE_VALUE ? compiler({
        env: 'CUSTOM'
      }) : null,
    ].filter(Boolean)
  },
  {
    input: 'output/worker-thread/index.safe.js',
    output: {
      file: 'dist/worker.safe.js',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      removeTestingDocument(),
      babelPlugin({
        transpileToES5: true,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
      MINIFY_BUNDLE_VALUE ? compiler({
        env: 'CUSTOM'
      }) : null,
    ].filter(Boolean)
  }
];

const debugModules = DEBUG_BUNDLE_VALUE ? [
  {
    input: 'output/worker-thread/index.js',
    output: {
      file: 'dist/debug.worker.js',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
      outro: 'window.workerDocument = documentForTesting;'
    },
    plugins: [
      removeTestingDocument(),
      babelPlugin({
        transpileToES5: false,
        allowConsole: DEBUG_BUNDLE_VALUE,
        allowPostMessage: false,
      }),
      MINIFY_BUNDLE_VALUE ? compiler({
        env: 'CUSTOM'
      }) : null,
    ].filter(Boolean)
  }
] : [];

export default [
  ...ESModules,
  ...IIFEModules,
  ...debugModules,
];