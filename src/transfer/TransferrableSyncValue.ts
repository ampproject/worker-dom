import { TransferrableKeys } from './TransferrableKeys';

export interface TransferrableSyncValue {
  readonly [TransferrableKeys.index]: number;
  readonly [TransferrableKeys.value]: string | number;
}
