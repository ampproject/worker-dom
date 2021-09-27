import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { terser } from 'rollup-plugin-terser';
import { babelPlugin, removeDebugCommandExecutors, removeWorkerWhitespace, replacePlugin } from './rollup.plugins.js';

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
      replacePlugin(),
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
      replacePlugin({ debug: true }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: true,
      }),
    ],
  },
  {
    input: 'output/main-thread/index.amp.js',
    output: {
      file: 'dist/amp-production/main.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      removeWorkerWhitespace(),
      removeDebugCommandExecutors(),
      replacePlugin({ amp: true }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: false,
      }),
      compiler(),
      terser(),
    ],
  },
  {
    input: 'output/main-thread/index.amp.js',
    output: {
      file: 'dist/amp-debug/main.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      removeWorkerWhitespace(),
      replacePlugin({ debug: true, amp: true }),
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
      replacePlugin(),
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
      replacePlugin({ debug: true, amp: true }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: true,
      }),
    ],
  },
];

export default [...ESModules, ...IIFEModules];
