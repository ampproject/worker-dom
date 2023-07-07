import { Element } from './Element';
import { toLower } from '../../utils';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

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

export const registerListenableProperties = (properties: { [key: string]: any }, defineOn: typeof Element): void => {
  const listenableProperties: string[] = [];
  for (const propertyName in properties) {
    if (!(propertyName in defineOn.prototype)) {
      listenableProperties.push(propertyName);

      Object.defineProperty(defineOn.prototype, propertyName, {
        enumerable: true,
        writable: true,
        value: properties[propertyName],
      });
    }
  }

  if (TransferrableKeys.listenableProperties in defineOn.prototype) {
    // parent properties
    listenableProperties.push(...defineOn.prototype[TransferrableKeys.listenableProperties]);
  }

  Object.defineProperty(defineOn.prototype, TransferrableKeys.listenableProperties, {
    enumerable: true,
    writable: false,
    value: listenableProperties,
  });
};
