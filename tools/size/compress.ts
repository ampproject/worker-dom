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

import { Context, ItemConfig, Compression } from './validation/Condition';
import { cpus } from 'os';
import bytes from 'bytes';
import { constants as brotliConstants, brotliCompress, gzip, ZlibOptions } from 'zlib';
import { readFile } from './fs';
import { bgGreen, bgRed, green, red } from 'kleur';

const COMPRESSION_CONCURRENCY = cpus().length;
const BROTLI_OPTIONS = {
  params: {
    [brotliConstants.BROTLI_PARAM_MODE]: brotliConstants.BROTLI_DEFAULT_MODE,
    [brotliConstants.BROTLI_PARAM_QUALITY]: brotliConstants.BROTLI_MAX_QUALITY,
    [brotliConstants.BROTLI_PARAM_SIZE_HINT]: 0,
  },
};
const GZIP_OPTIONS: ZlibOptions = {
  level: 9,
};

function report(item: ItemConfig, size: number): boolean {
  if (item.maxSize >= size) {
    console.log(`${bgGreen().black(' [PASS] ')} ${green(`${item.path} ${bytes(size)} <= ${bytes(item.maxSize)}`)}`);
    return true;
  }

  console.log(`${bgRed().white(' [FAIL] ')} ${red(`${item.path} ${bytes(size)} > ${bytes(item.maxSize)}`)}`);
  return false;
}

async function compressor(item: ItemConfig): Promise<boolean> {
  const contents = await readFile(item.path);
  if (contents) {
    const buffer = Buffer.from(contents, 'utf8');

    switch (item.compression) {
      case Compression.BROTLI:
        return new Promise(resolve => {
          brotliCompress(buffer, BROTLI_OPTIONS, (error: Error | null, result: Buffer) => {
            if (error !== null) {
              console.log(`${bgRed().white(' [ERROR] ')} ${red(`Could not compress '${item.path}' with '${item.compression}'.`)}`);
              process.exit();
              resolve(false);
            }
            resolve(report(item, result.byteLength));
          });
        });
      case Compression.GZIP:
        return new Promise(resolve => {
          gzip(buffer, GZIP_OPTIONS, (error: Error | null, result: Buffer) => {
            if (error !== null) {
              console.log(`${bgRed().white(' [ERROR] ')} ${red(`Could not compress '${item.path}' with '${item.compression}'.`)}`);
              process.exit();
              resolve(false);
            }
            resolve(report(item, result.byteLength));
          });
        });
      // return true;
      case Compression.NONE:
      default:
        return report(item, buffer.byteLength);
    }
  }

  return false;
}

export default async function compress(context: Context): Promise<void> {
  if (context.config.length > 0) {
    for (let iterator = 0; iterator < context.config.length; iterator = iterator + COMPRESSION_CONCURRENCY) {
      const concurrent = Math.min(COMPRESSION_CONCURRENCY, context.config.length - iterator);
      await Promise.all(Array.from({ length: concurrent }, (_: any, i: number) => compressor(context.config[iterator + i])));
    }
  }
}
