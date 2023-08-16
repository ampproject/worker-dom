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
import replace from '@rollup/plugin-replace';
import { babelPlugin } from './rollup.plugins.js';
import path from 'path';

// Compile plugins should always be added at the end of the plugin list.
const compilePlugins = [
  compiler({
    env: 'CUSTOM',
  }),
  terser(),
];

export default [
  {
    input: path.join(__dirname, '../output/main-thread/lib.js'),
    output: {
      file: 'dist/lib/main.mjs',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      replace({
        WORKER_DOM_DEBUG: false,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: false,
      }),
      ...compilePlugins,
    ],
  },
  {
    input: path.join(__dirname, '../output/worker-thread/lib.js'),
    output: {
      file: 'dist/lib/worker.mjs',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      replace({
        WORKER_DOM_DEBUG: false,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: false,
      }),
      ...compilePlugins,
    ],
  },
];
