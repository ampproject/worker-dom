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
import fs from 'fs';
import path from 'path';
const walk = require('acorn-walk');

/**
 * Invoke Babel on source, with some configuration.
 * @param {object} config, two keys transpileToES5, and allowConsole
 * - transpileToES5 Should we transpile down to ES5 or features supported by `module` capable browsers?
 * - allowConsole Should we allow `console` methods in the output?
 * - allowPostMessage Should we allow postMessage to/from the Worker?
 */
export function babelPlugin({ transpileToES5, allowConsole = false, allowPostMessage = true }) {
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
      [
        'babel-plugin-minify-replace',
        {
          replacements: [
            {
              identifierName: '__ALLOW_POST_MESSAGE__',
              replacement: {
                type: 'booleanLiteral',
                value: allowPostMessage,
              },
            },
          ],
        },
      ],
      ['babel-plugin-transform-remove-console', { exclude }],
    ],
  });
}

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
    renderChunk: async code => {
      const source = new MagicString(code);
      const program = context.parse(code, { ranges: true });

      walk.simple(program, {
        VariableDeclarator(node) {
          if (node.id && node.id.type === 'Identifier' && node.id.name && node.id.name === 'documentForTesting') {
            if (node.range) {
              source.overwrite(node.range[0], node.range[1], 'documentForTesting = undefined');
            }
          }
        },
      });

      return {
        code: source.toString(),
        map: source.generateMap(),
      };
    },
  };
}

/**
 * RollupPlugin that removes the debugging printers from CommandExecutors.
 */
export function removeDebugCommandExecutors() {
  let context;
  let toDiscover;

  return {
    name: 'remove-debug-command-executors',
    buildStart(options) {
      context = this;
      toDiscover = fs
        .readdirSync(path.join(path.dirname(options.input), 'commands'))
        .filter(file => path.extname(file) !== '.map' && path.basename(file, '.js') !== 'interface').length;
    },
    renderChunk: async code => {
      const source = new MagicString(code);
      const program = context.parse(code, { ranges: true });

      walk.simple(program, {
        ExpressionStatement(node) {
          if (node.expression.type === 'AssignmentExpression') {
            const { expression } = node;
            if (
              expression.left.type === 'MemberExpression' &&
              expression.left.object.type === 'ThisExpression' &&
              expression.left.property.type === 'Identifier' &&
              expression.left.property.name === 'print'
            ) {
              toDiscover--;
              if (node.range) {
                source.remove(node.range[0], node.range[1]);
              }
            }
          }
        },
      });

      if (toDiscover > 0) {
        context.warn(`${toDiscover} CommandExecutors were not found during compilation.`);
      }

      return {
        code: source.toString(),
        map: source.generateMap(),
      };
    },
  };
}
