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

export const toLower = (value: string): string => value.toLowerCase();

export const toUpper = (value: string): string => value.toUpperCase();

export const containsIndexOf = (pos: number): boolean => pos !== -1;

export const keyValueString = (key: string, value: string): string => `${key}="${value}"`;

export const enum NumericBoolean {
  FALSE = 0,
  TRUE = 1,
}
