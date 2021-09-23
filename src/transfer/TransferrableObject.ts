import { TransferrableKeys } from './TransferrableKeys';

export interface TransferrableObject {
  /**
   * Retrieves an array of values that allow the retrieval of a specific object in the main thread.
   */
  [TransferrableKeys.serializeAsTransferrableObject](): number[];
}

type SerializableType = TransferrableObject | number | string;
export type Serializable = SerializableType | SerializableType[];
