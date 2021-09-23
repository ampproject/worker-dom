export const toLower = (value: string): string => value.toLowerCase();

export const toUpper = (value: string): string => value.toUpperCase();

export const containsIndexOf = (pos: number): boolean => pos !== -1;

export const keyValueString = (key: string, value: string): string => `${key}="${value}"`;

export const enum NumericBoolean {
  FALSE = 0,
  TRUE = 1,
}
