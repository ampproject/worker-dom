let count: number = 0;
let transfer: Array<string> = [];
const mapping: Map<string, number> = new Map();

/**
 * Stores a string in mapping and returns the index of the location.
 * @param value string to store
 * @return location in map
 */
export function store(value: string): number {
  // Server version of the lib never transfers.
  if (process.env.SERVER) {
    return 0;
  }

  if (mapping.has(value)) {
    // Safe to cast since we verified the mapping contains the value
    return mapping.get(value) as number;
  }

  mapping.set(value, count);
  transfer.push(value);
  return count++;
}

/**
 * Retrieve the index for a string (mostly used for tests).
 * @param value string value we need to know the index of
 * @returns index in the map for the string
 */
export function getForTesting(value: string): number | undefined {
  return mapping.get(value);
}

export function getForTestingPartial(value: string): number | undefined {
  const found = Array.from(mapping.keys()).find((str) => str.includes(value));
  if (found) {
    return mapping.get(found);
  }
}

/**
 * Returns strings registered but not yet transferred.
 * Side effect: Resets the transfer array to default value, to prevent passing the same values multiple times.
 */
export function consume(): Array<string> {
  const strings = transfer;
  transfer = [];
  return strings;
}
