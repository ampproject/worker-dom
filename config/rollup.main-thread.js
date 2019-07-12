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
import { babelPlugin, removeDebugCommandExecutors, removeWorkerWhitespace } from './rollup.plugins.js';

const ESModules = [
  {
    input: 'output/main-thread/index.js',
    output: {
      file: 'dist/main.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      removeWorkerWhitespace(),
      removeDebugCommandExecutors(),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: false,
      }),
      compiler(),
      terser(),
    ],
  },
  {
    input: 'output/main-thread/index.js',
    output: {
      file: 'dist/debug/main.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      removeWorkerWhitespace(),
      copy({
        targets: [
          {
            src: 'config/dist-packaging/debug/package.json',
            dest: 'dist/debug',
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
    input: 'output/main-thread/index.amp.js',
    output: {
      file: 'dist/amp/main.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      removeWorkerWhitespace(),
      copy({
        targets: [
          {
            src: 'config/dist-packaging/amp/package.json',
            dest: 'dist/amp',
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
];

const IIFEModules = [
  {
    input: 'output/main-thread/index.js',
    output: {
      file: 'dist/main.js',
      format: 'iife',
      name: 'MainThread',
      sourcemap: true,
    },
    plugins: [
      removeWorkerWhitespace(),
      removeDebugCommandExecutors(),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: false,
      }),
      compiler(),
      terser(),
    ],
  },
  {
    input: 'output/main-thread/index.js',
    output: {
      file: 'dist/debug/main.js',
      format: 'iife',
      name: 'MainThread',
      sourcemap: true,
    },
    plugins: [
      removeWorkerWhitespace(),
      replace({
        DEBUG_ENABLED: true,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: true,
      }),
      compiler(),
      terser(),
    ],
  },
];

export default [...ESModules, ...IIFEModules];
