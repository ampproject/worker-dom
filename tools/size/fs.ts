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

import { promises as fs } from 'fs';

export async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await fs.lstat(path)).isDirectory();
  } catch (e) {}
  return false;
}

export async function isFile(path: string): Promise<boolean> {
  try {
    return (await fs.lstat(path)).isFile();
  } catch (e) {}
  return false;
}

export async function readFile(path: string): Promise<string | null> {
  try {
    return await fs.readFile(path, 'utf-8');
  } catch (e) {}
  return null;
}
