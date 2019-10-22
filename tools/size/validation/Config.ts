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

import { Context, ConditionFunction, ItemConfig } from './Condition';
import { readFile } from '../fs';
import ValidateBundle, { BundleContainsKeys } from './Bundle';
import { bgRed, red } from 'kleur';

const READABLE_KEY_NAMES = ['path', 'compression', 'maxSize'];

const Config: ConditionFunction = (context: Context) => {
  return async function() {
    let contents: string = '';

    const readFileAttempt: string | null = await readFile(context.package);
    if (readFileAttempt !== null) {
      contents = readFileAttempt;
    } else {
      return [false, bgRed('[ ERROR ]') + red(`Could not read the configuration from '${context.package}'`)];
    }

    try {
      const { bundlesize } = JSON.parse(contents);

      if (typeof bundlesize === 'undefined') {
        return [false, bgRed('[ ERROR ]') + red(`There was no 'bundlesize' configuration in '${context.package}'`)];
      } else if (Array.isArray(bundlesize)) {
        let index = 0;

        for (const bundle of bundlesize) {
          index++;

          const hasNecessaryKeys = BundleContainsKeys(bundle);
          if (hasNecessaryKeys.success) {
            const validatedItem = await ValidateBundle(bundle, index);

            if (validatedItem.success) {
              context.config.push(validatedItem.config as ItemConfig);
            } else {
              return [false, validatedItem.error];
            }
          } else {
            const message =
              bgRed('[ ERROR ]') +
              red(
                `Item ${bundle.path ? `'${bundle.path}'` : `#${index}`} in 'bundlesize' configuration is invalid. (key: ${
                  READABLE_KEY_NAMES[hasNecessaryKeys.invalid as number]
                })`,
              );
            return [false, message];
          }
        }
      }

      return [true, null];
    } catch (e) {
      return [false, bgRed('[ ERROR ]') + red(`Could not parse '${context.package}'`)];
    }
  };
};

export default Config;
