import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
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
    input: 'output/worker-thread/server-lib.js',
    output: {
      file: 'dist/server-lib.mjs',
      format: 'es',
      name: 'ServerLib',
      sourcemap: true,
    },
    plugins: [
      replace({
        values: {
          WORKER_DOM_DEBUG: false,
          IS_SERVER: true,
        },
        preventAssignment: true,
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
      file: 'dist/worker/worker.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        values: {
          WORKER_DOM_DEBUG: false,
          IS_SERVER: false,
        },
        preventAssignment: true,
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
      replace({
        values: {
          WORKER_DOM_DEBUG: true,
          IS_SERVER: false,
        },
        preventAssignment: true,
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
      file: 'dist/amp-production/worker/worker.mjs',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        values: {
          WORKER_DOM_DEBUG: false,
          IS_SERVER: false,
        },
        preventAssignment: true,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: false,
      }),
      ...compilePlugins,
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
        transpileToES5: false,
        allowConsole: true,
      }),
    ],
  },
  {
    input: 'output/worker-thread/index.amp.js',
    output: {
      file: 'dist/amp-production/worker/worker.js',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        values: {
          WORKER_DOM_DEBUG: false,
        },
        preventAssignment: true,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: false,
      }),
      ...compilePlugins,
    ],
  },
  {
    input: 'output/worker-thread/index.amp.js',
    output: {
      file: 'dist/amp-debug/worker/worker.js',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        values: {
          WORKER_DOM_DEBUG: true,
        },
        preventAssignment: true,
      }),
      babelPlugin({
        transpileToES5: true,
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
        values: {
          WORKER_DOM_DEBUG: false,
        },
        preventAssignment: true,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: true,
      }),
      ...compilePlugins,
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
        values: {
          WORKER_DOM_DEBUG: true,
        },
        preventAssignment: true,
      }),
      babelPlugin({
        transpileToES5: false,
        allowConsole: true,
      }),
    ],
  },
  {
    input: 'output/worker-thread/index.nodom.amp.js',
    output: {
      file: 'dist/amp-production/worker/worker.nodom.js',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        values: {
          WORKER_DOM_DEBUG: false,
        },
        preventAssignment: true,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: false,
      }),
      ...compilePlugins,
    ],
  },
  {
    input: 'output/worker-thread/index.nodom.amp.js',
    output: {
      file: 'dist/amp-debug/worker/worker.nodom.js',
      format: 'iife',
      name: 'WorkerThread',
      sourcemap: true,
    },
    plugins: [
      replace({
        values: {
          WORKER_DOM_DEBUG: true,
        },
        preventAssignment: true,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: true,
      }),
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
        values: {
          WORKER_DOM_DEBUG: false,
        },
        preventAssignment: true,
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
        values: {
          WORKER_DOM_DEBUG: true,
        },
        preventAssignment: true,
      }),
      babelPlugin({
        transpileToES5: true,
        allowConsole: true,
      }),
    ],
  },
];

export default [...ESModules, ...IIFEModules];
