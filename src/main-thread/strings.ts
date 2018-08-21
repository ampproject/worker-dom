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

let count: number = 0;
const STRINGS: Map<number, string> = new Map();

/**
 * Return a string for the specified index.
 * @param index string index to retrieve.
 * @returns string in map for the index.
 */
export function getString(index: number): string {
  return STRINGS.get(index) || '';
}

/**
 * Stores a string for parsing from mutation
 * @param value string to store from background thread.
 */
export function storeString(value: string): void {
  STRINGS.set(++count, value);
}
