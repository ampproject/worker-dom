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

type PropertyValue = string | boolean | number;
type AttributeName = string;
type AttributeKeywords = [string, string];

export interface PropertyPair {
  [property: string]: {
    // The default value for this property.
    0: PropertyValue;
    // Some properties correspond to an attribute with a different name, e.g. .className vs. 'class'.
    1?: AttributeName;
    // Enumerated attributes have keyword values, e.g. translate=yes|no.
    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#keywords-and-enumerated-attributes
    2?: AttributeKeywords;
  };
}

// TODO: Do all boolean attributes have boolean properties?
// TODO: Do enumerated attributes with non-boolean properties exist?

export const reflectProperties = (properties: Array<PropertyPair>, defineOn: typeof Element): void => {
  properties.forEach((pair) => {
    for (const property in pair) {
      const { 0: defaultValue, 1: attributeName = toLower(property), 2: keywords } = pair[property];
      // Boolean attributes only care about presence, not attribute value.
      // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
      const isBooleanAttribute = typeof defaultValue === 'boolean';

      Object.defineProperty(defineOn.prototype, property, {
        enumerable: true,
        get(): PropertyValue {
          const element = this as Element;
          const attributeValue = element.getAttribute(attributeName);
          if (keywords) {
            return element.hasAttribute(attributeName) ? attributeValue === keywords[0] : defaultValue;
          }
          if (isBooleanAttribute) {
            return element.hasAttribute(attributeName);
          }
          const castableValue = attributeValue || defaultValue;
          return typeof defaultValue === 'number' ? Number(castableValue) : String(castableValue);
        },
        set(value: PropertyValue) {
          const element = this as Element;
          if (keywords) {
            element.setAttribute(attributeName, value ? keywords[0] : keywords[1]);
          } else if (isBooleanAttribute) {
            value ? element.setAttribute(attributeName, '') : element.removeAttribute(attributeName);
          } else {
            element.setAttribute(attributeName, String(value));
          }
        },
      });
    }
  });
};
