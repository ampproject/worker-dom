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
          loose: transpileToES5 ? false : true,
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
 * Formats valid output for trimmed ObjectExpressions.
 * @param {string} code
 * @param {Array<Array<number, number>>} validPropertyRanges
 */
const outputPropertyRange = (code, validPropertyRanges) =>
  `{
    ${validPropertyRanges.map((range, index) => `${index > 0 ? '\n\t\t' : ''}${code.substring(range[0], range[1])}`)}
  }`;

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
    renderChunk(code) {
      const source = new MagicString(code);
      const program = context.parse(code, { ranges: true });

      walk.simple(program, {
        ObjectExpression(node) {
          const propertyNames = (node.properties && node.properties.map(property => property.key.name)) || [];
          const validPropertyRanges = [];

          if (propertyNames.includes('execute') && propertyNames.includes('print')) {
            for (const property of node.properties) {
              if (property.key.type === 'Identifier') {
                if (property.key.name === 'print') {
                  toDiscover--;
                } else {
                  validPropertyRanges.push([property.range[0], property.range[1]]);
                }
              }
            }

            source.overwrite(node.range[0], node.range[1], outputPropertyRange(code, validPropertyRanges));
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

export function removeWorkerWhitespace() {
  return {
    name: 'remove-worker-whitespace',
    transform(code) {
      const source = new MagicString(code);
      const program = this.parse(code, { ranges: true });

      walk.simple(program, {
        TemplateLiteral(node) {
          let literalValue = code.substring(node.range[0], node.range[1]);
          literalValue = literalValue
            .replace(/\) \{/g, '){')
            .replace(/, /g, ',')
            .replace(/ = /g, '=')
            .replace(/\t/g, '')
            .replace(/[ ]{2,}/g, '')
            .replace(/\n/g, '');
          source.overwrite(node.range[0], node.range[1], literalValue);
        },
      });

      return {
        code: source.toString(),
        map: source.generateMap(),
      };
    },
  };
}
