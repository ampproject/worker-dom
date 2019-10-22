'use strict';
/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const fs_1 = require('../fs');
const Bundle_1 = __importStar(require('./Bundle'));
const kleur_1 = require('kleur');
const READABLE_KEY_NAMES = ['path', 'compression', 'maxSize'];
const Config = context => {
  return async function() {
    let contents = '';
    const readFileAttempt = await fs_1.readFile(context.package);
    if (readFileAttempt !== null) {
      contents = readFileAttempt;
    } else {
      return [false, kleur_1.bgRed('[ ERROR ]') + kleur_1.red(`Could not read the configuration from '${context.package}'`)];
    }
    try {
      const { bundlesize } = JSON.parse(contents);
      if (typeof bundlesize === 'undefined') {
        return [false, kleur_1.bgRed('[ ERROR ]') + kleur_1.red(`There was no 'bundlesize' configuration in '${context.package}'`)];
      } else if (Array.isArray(bundlesize)) {
        let index = 0;
        for (const bundle of bundlesize) {
          index++;
          const hasNecessaryKeys = Bundle_1.BundleContainsKeys(bundle);
          if (hasNecessaryKeys.success) {
            const validatedItem = await Bundle_1.default(bundle, index);
            if (validatedItem.success) {
              context.config.push(validatedItem.config);
            } else {
              return [false, validatedItem.error];
            }
          } else {
            const message =
              kleur_1.bgRed('[ ERROR ]') +
              kleur_1.red(
                `Item ${bundle.path ? `'${bundle.path}'` : `#${index}`} in 'bundlesize' configuration is invalid. (key: ${
                  READABLE_KEY_NAMES[hasNecessaryKeys.invalid]
                })`,
              );
            return [false, message];
          }
        }
      }
      return [true, null];
    } catch (e) {
      return [false, kleur_1.bgRed('[ ERROR ]') + kleur_1.red(`Could not parse '${context.package}'`)];
    }
  };
};
exports.default = Config;
//# sourceMappingURL=Config.js.map
