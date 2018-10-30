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
const strings: Map<number, string> = new Map();

/**
 * Return a string for the specified index.
 * @param index string index to retrieve.
 * @returns string in map for the index.
 */
export function get(index: number): string {
  return strings.get(index) || '';
}

/**
 * Stores a string in mapping and returns the index of the location.
 * @param value string to store
 * @return location in map
 */
export function store(value: string): number {
  // When the main thread is in mutation phase, all additions to the store
  // are directed by the background thread. This other thread is responsible for
  // the size and shape of the map.
  strings.set(++count, value);
  return count;
}
