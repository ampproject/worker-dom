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

import { ItemConfig, Compression } from './Condition';
import { isFile } from '../fs';
import { resolve } from 'path';
import bytes from 'bytes';
import { bgRed, red } from 'kleur';

const READABLE_KEY_NAMES = ['path', 'compression', 'maxSize'];

function compressionValue(fsValue: string): { compression: Compression; error: string | null } {
  switch (fsValue.toLowerCase()) {
    case 'brotli':
      return { compression: Compression.BROTLI, error: null };
    case 'gzip':
      return { compression: Compression.GZIP, error: null };
    case '':
    case 'none':
      return { compression: Compression.NONE, error: null };
    default:
      return { compression: Compression.NONE, error: `Invalid compression value '${fsValue}'` };
  }
}

export function BundleContainsKeys(bundle: { [key: string]: string }): { success: boolean; invalid: number | null } {
  const mandatoryValues = READABLE_KEY_NAMES.map(key => bundle[key]);
  const missingKeyIndex = mandatoryValues.findIndex(item => typeof item !== 'string');

  return { success: missingKeyIndex < 0, invalid: missingKeyIndex < 0 ? null : missingKeyIndex };
}

export default async function ValidateBundle(
  bundle: { path: string; compression: string; maxSize: string },
  index: number,
): Promise<{ success: boolean; config: ItemConfig | null; error: string | null }> {
  const path = resolve(bundle.path);
  const { compression, error: compressionError } = compressionValue(bundle.compression);
  const maxSize = bytes(bundle.maxSize);

  const invalidValue = [await isFile(path), compressionError === null, maxSize > 0].findIndex(item => item === false);
  if (invalidValue >= 0) {
    const valueErrorMapping = [red('(path is not a valid file.)'), red(`(${compressionError})`), red('(maxSize is not a valid size.)')];

    return {
      success: false,
      config: null,
      error:
        bgRed('[ ERROR ]') +
        red(`Item ${bundle.path ? `'${bundle.path}'` : `#${index}`} in 'bundlesize' configuration is invalid. ${valueErrorMapping[invalidValue]}`),
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
