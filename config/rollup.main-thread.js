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

import resolve from 'rollup-plugin-node-resolve';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
import { babelPlugin, removeDebugCommandExecutors } from './rollup.plugins.js';
import { MINIFY_BUNDLE_VALUE, DEBUG_BUNDLE_VALUE } from './rollup.utils.js';

const ESModules = [
  {
    input: 'output/main-thread/index.js',
    output: {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      removeDebugCommandExecutors(),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
      MINIFY_BUNDLE_VALUE ? compiler() : null,
      MINIFY_BUNDLE_VALUE ? terser() : null,
    ].filter(Boolean),
  },
  {
    input: 'output/main-thread/index.js',
    output: {
      file: 'dist/unminified.index.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      removeDebugCommandExecutors(),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
    ].filter(Boolean),
  },
  {
    input: 'output/main-thread/index.safe.js',
    output: {
      file: 'dist/index.safe.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      removeDebugCommandExecutors(),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
      MINIFY_BUNDLE_VALUE ? compiler() : null,
      MINIFY_BUNDLE_VALUE ? terser() : null,
    ].filter(Boolean),
  },
  {
    input: 'output/main-thread/index.safe.js',
    output: {
      file: 'dist/unminified.index.safe.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      removeDebugCommandExecutors(),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
    ].filter(Boolean),
  },
];

const IIFEModules = [
  {
    input: 'output/main-thread/index.js',
    output: {
      file: 'dist/index.js',
      format: 'iife',
      name: 'MainThread',
      sourcemap: true,
    },
    plugins: [
      removeDebugCommandExecutors(),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
      MINIFY_BUNDLE_VALUE ? compiler() : null,
      MINIFY_BUNDLE_VALUE ? terser() : null,
    ].filter(Boolean),
  },
  {
    input: 'output/main-thread/index.js',
    output: {
      file: 'dist/unminified.index.js',
      format: 'iife',
      name: 'MainThread',
      sourcemap: true,
    },
    plugins: [
      removeDebugCommandExecutors(),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
    ].filter(Boolean),
  },
  {
    input: 'output/main-thread/index.safe.js',
    output: {
      file: 'dist/index.safe.js',
      format: 'iife',
      name: 'MainThread',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      removeDebugCommandExecutors(),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
      MINIFY_BUNDLE_VALUE ? compiler() : null,
      MINIFY_BUNDLE_VALUE ? terser() : null,
    ].filter(Boolean),
  },
  {
    input: 'output/main-thread/index.safe.js',
    output: {
      file: 'dist/unminified.index.safe.js',
      format: 'iife',
      name: 'MainThread',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      removeDebugCommandExecutors(),
      replace({
        DEBUG_ENABLED: false,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: DEBUG_BUNDLE_VALUE,
      }),
    ].filter(Boolean),
  },
];

const debugModules = DEBUG_BUNDLE_VALUE
  ? [
      {
        input: 'output/main-thread/index.js',
        output: {
          file: 'dist/debug.index.js',
          format: 'iife',
          name: 'MainThread',
          sourcemap: true,
        },
        plugins: [
          replace({
            DEBUG_ENABLED: true,
          }),
          babelPlugin({
            transpileToES5: false,
            allowConsole: true,
          }),
          MINIFY_BUNDLE_VALUE ? compiler() : null,
          MINIFY_BUNDLE_VALUE ? terser() : null,
        ].filter(Boolean),
      },
    ]
  : [];

export default [...ESModules, ...IIFEModules, ...debugModules];
