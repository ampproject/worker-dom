import { TransferrableKeys } from './TransferrableKeys.js';

export interface TransferrableSyncValue {
  readonly [TransferrableKeys.index]: number;
  readonly [TransferrableKeys.value]: string | number;
}
