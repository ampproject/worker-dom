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
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const Condition_1 = require('./Condition');
const fs_1 = require('../fs');
const path_1 = require('path');
const bytes_1 = __importDefault(require('bytes'));
const kleur_1 = require('kleur');
const READABLE_KEY_NAMES = ['path', 'compression', 'maxSize'];
function compressionValue(fsValue) {
  switch (fsValue.toLowerCase()) {
    case 'brotli':
      return { compression: Condition_1.Compression.BROTLI, error: null };
    case 'gzip':
      return { compression: Condition_1.Compression.GZIP, error: null };
    case '':
    case 'none':
      return { compression: Condition_1.Compression.NONE, error: null };
    default:
      return { compression: Condition_1.Compression.NONE, error: `Invalid compression value '${fsValue}'` };
  }
}
function BundleContainsKeys(bundle) {
  const mandatoryValues = READABLE_KEY_NAMES.map(key => bundle[key]);
  const missingKeyIndex = mandatoryValues.findIndex(item => typeof item !== 'string');
  return { success: missingKeyIndex < 0, invalid: missingKeyIndex < 0 ? null : missingKeyIndex };
}
exports.BundleContainsKeys = BundleContainsKeys;
async function ValidateBundle(bundle, index) {
  const path = path_1.resolve(bundle.path);
  const { compression, error: compressionError } = compressionValue(bundle.compression);
  const maxSize = bytes_1.default(bundle.maxSize);
  const invalidValue = [await fs_1.isFile(path), compressionError === null, maxSize > 0].findIndex(item => item === false);
  if (invalidValue >= 0) {
    const valueErrorMapping = [
      kleur_1.red('(path is not a valid file.)'),
      kleur_1.red(`(${compressionError})`),
      kleur_1.red('(maxSize is not a valid size.)'),
    ];
    return {
      success: false,
      config: null,
      error:
        kleur_1.bgRed('[ ERROR ]') +
        kleur_1.red(
          `Item ${bundle.path ? `'${bundle.path}'` : `#${index}`} in 'bundlesize' configuration is invalid. ${valueErrorMapping[invalidValue]}`,
        ),
    };
  }
  return {
    success: true,
    config: {
      path,
      compression,
      maxSize,
    },
    error: null,
  };
}
exports.default = ValidateBundle;
//# sourceMappingURL=Bundle.js.map
