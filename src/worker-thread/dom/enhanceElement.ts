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

import { Element } from './Element';
import { toLower } from '../../utils';

export interface PropertyPair {
  [key: string]: [string | boolean | number, string] | [string | boolean | number];
}
export const reflectProperties = (properties: Array<PropertyPair>, defineOn: typeof Element): void => {
  properties.forEach(pair => {
    for (let key in pair) {
      const defaultValue = pair[key][0];
      const propertyIsNumber = typeof defaultValue === 'number';
      const propertyIsBoolean = typeof defaultValue === 'boolean';
      const attributeKey = (pair[key][1] as string) || toLower(key);
      Object.defineProperty(defineOn.prototype, key, {
        enumerable: true,
        get(): string | boolean | number {
          const storedAttribute = (this as Element).getAttribute(attributeKey);
          if (propertyIsBoolean) {
            return storedAttribute !== null ? storedAttribute === 'true' : defaultValue;
          }
          const castableValue = storedAttribute || defaultValue;
          return propertyIsNumber ? Number(castableValue) : String(castableValue);
        },
        set(value: string | boolean | number) {
          (this as Element).setAttribute(attributeKey, String(value));
        },
      });
    }
  });
};
