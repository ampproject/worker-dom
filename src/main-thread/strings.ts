/**
 * Stores indexed strings that are used in postMessage() calls from the worker.
 */
export class StringContext {
  private strings: Array<string>;

  constructor() {
    this.strings = [];
  }

  /**
   * Return a string for the specified index.
   * @param index string index to retrieve.
   * @return string in map for the index.
   */
  get(index: number): string {
    return this.strings[index] || '';
  }

  hasIndex(index: number) {
    return this.strings[index] !== undefined;
  }

  /**
   * Stores a string in mapping and returns the index of the location.
   * @param value string to store
   * @return {number}
   */
  store(value: string): number {
    this.strings.push(value);
    return this.strings.length - 1;
  }

  /**
   * Stores a set of strings.
   * @param values
   */
  storeValues(values: Array<string>): void {
    values.forEach((v) => this.store(v));
  }
}
