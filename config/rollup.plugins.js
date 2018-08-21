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

import babel from 'rollup-plugin-babel';
import MagicString from 'magic-string';
const walk = require('acorn/dist/walk');

/**
 * Invoke Babel on source, with some configuration.
 * @param {object} config, two keys transpileToES5, and allowConsole 
 * - transpileToES5 Should we transpile down to ES5 or features supported by `module` capable browsers?
 * - allowConsole Should we allow `console` methods in the output?
 * - allowPostMessage Should we allow postMessage to/from the Worker?
 */
export function babelPlugin({transpileToES5, allowConsole = false, allowPostMessage = true}) {
  const targets = transpileToES5 ? { browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'] } : { esmodules: true };
  const exclude = allowConsole ? ['error', 'warn', 'trace', 'info', 'log', 'time', 'timeEnd'] : [];

  return babel({
    exclude: 'node_modules/**',
    presets: [
      [
        '@babel/env',
        {
          targets,
          loose: true,
          modules: false,
        },
      ],
    ],
    plugins: [
      ['@babel/plugin-proposal-object-rest-spread'],
      ['@babel/proposal-class-properties'],
      ['babel-plugin-minify-replace', {
        'replacements': [{
          'identifierName': '__ALLOW_POST_MESSAGE__',
          'replacement': {
            'type': 'booleanLiteral',
            'value': allowPostMessage
          }
        }]
      }],
      ['babel-plugin-transform-remove-console', { exclude }],
    ],
  });
};

/**
 * RollupPlugin that removes the testing document singleton from output source.
 */
export function removeTestingDocument() {
  let context;

  return {
    name: 'remove-testing-document',
    buildStart() {
      context = this;
    },
    transformChunk: async (code) => {
      const source = new MagicString(code);

      if (context) {
        const program = context.parse(code, { ranges: true });

        walk.simple(program, {
          VariableDeclarator(node) {
            if (node.id && node.id.type === 'Identifier' && node.id.name && node.id.name === 'documentForTesting') {
              const range = node.range;
              if (range) {
                source.overwrite(node.range[0], node.range[1], 'documentForTesting = undefined');
              }
            }
          },
        });
      }
      
      return {
        code: source.toString(),
        map: source.generateMap(),
      };
    },
  };
}