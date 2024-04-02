export const toLower = (value: string): string => value.toLowerCase();

export const toUpper = (value: string): string => value.toUpperCase();

export const containsIndexOf = (pos: number): boolean => pos !== -1;

export const keyValueString = (key: string, value: string): string => `${key}="${value}"`;

export const enum NumericBoolean {
  FALSE = 0,
  TRUE = 1,
}

export interface Msg<T extends any = any> {
  type: 'initHydrateArgs';
  data: T;
}
export function listenToMsgType<T>(target: Worker | typeof globalThis, type: Msg<T>['type'], listener: (data: Msg<T>) => any) {
  const _listener = (e: any) => {
    if (e.data?.type === type) listener(e.data);
  };
  target.addEventListener('message', _listener);
  return () => target.removeEventListener('message', _listener);
}

export function waitForMsg<T>(target: Worker | typeof globalThis, type: Msg<T>['type']): Promise<Msg<T>> {
  return new Promise((res) => {
    const removeListener = listenToMsgType<T>(target, type, (data) => {
      removeListener();
      res(data);
    });
  });
}

export function postMsg<T>(target: Worker | typeof globalThis, type: Msg<T>['type'], data?: T) {
  return target.postMessage({ type, data });
}
