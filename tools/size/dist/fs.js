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
Object.defineProperty(exports, '__esModule', { value: true });
const fs_1 = require('fs');
async function isDirectory(path) {
  try {
    return (await fs_1.promises.lstat(path)).isDirectory();
  } catch (e) {}
  return false;
}
exports.isDirectory = isDirectory;
async function isFile(path) {
  try {
    return (await fs_1.promises.lstat(path)).isFile();
  } catch (e) {}
  return false;
}
exports.isFile = isFile;
async function readFile(path) {
  try {
    return await fs_1.promises.readFile(path, 'utf-8');
  } catch (e) {}
  return null;
}
exports.readFile = readFile;
//# sourceMappingURL=fs.js.map
