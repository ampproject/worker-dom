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
const Condition_1 = require('./validation/Condition');
const os_1 = require('os');
const bytes_1 = __importDefault(require('bytes'));
const zlib_1 = require('zlib');
const fs_1 = require('./fs');
const kleur_1 = require('kleur');
const COMPRESSION_CONCURRENCY = os_1.cpus().length;
const BROTLI_OPTIONS = {
  params: {
    [zlib_1.constants.BROTLI_PARAM_MODE]: zlib_1.constants.BROTLI_DEFAULT_MODE,
    [zlib_1.constants.BROTLI_PARAM_QUALITY]: zlib_1.constants.BROTLI_MAX_QUALITY,
    [zlib_1.constants.BROTLI_PARAM_SIZE_HINT]: 0,
  },
};
const GZIP_OPTIONS = {
  level: 9,
};
function report(item, size) {
  if (item.maxSize >= size) {
    console.log(
      `${kleur_1.bgGreen().black(' [PASS] ')} ${kleur_1.green(`${item.path} ${bytes_1.default(size)} <= ${bytes_1.default(item.maxSize)}`)}`,
    );
    return true;
  }
  console.log(`${kleur_1.bgRed().white(' [FAIL] ')} ${kleur_1.red(`${item.path} ${bytes_1.default(size)} > ${bytes_1.default(item.maxSize)}`)}`);
  return false;
}
async function compressor(item) {
  const contents = await fs_1.readFile(item.path);
  if (contents) {
    const buffer = Buffer.from(contents, 'utf8');
    switch (item.compression) {
      case Condition_1.Compression.BROTLI:
        return new Promise(resolve => {
          zlib_1.brotliCompress(buffer, BROTLI_OPTIONS, (error, result) => {
            if (error !== null) {
              console.log(`${kleur_1.bgRed().white(' [ERROR] ')} ${kleur_1.red(`Could not compress '${item.path}' with '${item.compression}'.`)}`);
              process.exit();
              resolve(false);
            }
            resolve(report(item, result.byteLength));
          });
        });
      case Condition_1.Compression.GZIP:
        return new Promise(resolve => {
          zlib_1.gzip(buffer, GZIP_OPTIONS, (error, result) => {
            if (error !== null) {
              console.log(`${kleur_1.bgRed().white(' [ERROR] ')} ${kleur_1.red(`Could not compress '${item.path}' with '${item.compression}'.`)}`);
              process.exit();
              resolve(false);
            }
            resolve(report(item, result.byteLength));
          });
        });
      // return true;
      case Condition_1.Compression.NONE:
      default:
        return report(item, buffer.byteLength);
    }
  }
  return false;
}
async function compress(context) {
  if (context.config.length > 0) {
    for (let iterator = 0; iterator < context.config.length; iterator = iterator + COMPRESSION_CONCURRENCY) {
      const concurrent = Math.min(COMPRESSION_CONCURRENCY, context.config.length - iterator);
      await Promise.all(Array.from({ length: concurrent }, (_, i) => compressor(context.config[iterator + i])));
    }
  }
}
exports.default = compress;
//# sourceMappingURL=compress.js.map
