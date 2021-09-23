/**
 * Allows clients to apply restrictions on DOM and storage changes.
 */
declare interface Sanitizer {
  /**
   * @param node
   * @return True if `node.nodeName` is allowed.
   */
  sanitize(node: Node): boolean;

  /**
   * Requests an element attribute change.
   * @param node
   * @param attr
   * @param value
   * @return True if attribute change was applied.
   */
  setAttribute(node: Node, attr: string, value: string | null): boolean;

  /**
   * Requests a node property change.
   * @param node
   * @param prop
   * @param value
   * @return True if property change was applied.
   */
  setProperty(node: Node, prop: string, value: string): boolean;

  /**
   * Retrieves the current localStorage or sessionStorage data.
   * @param location `0` for localStorage, `1` for sessionStorage, `2` for AMP state.
   * @param key A storage item key (optional). To get all keys, pass `undefined` here.
   * @return
   */
  getStorage(location: number, key?: string | null): Promise<StorageValue>;

  /**
   * Requests a change in localStorage or sessionStorage.
   * @param location `0` for localStorage, `1` for sessionStorage, `2` for AMP state.
   * @param key A storage item key. To change all keys, pass `null` here.
   * @param value A storage value. To remove a key, pass `null` here.
   * @return True if storage change was applied.
   */
  setStorage(location: number, key: string | null, value: string | null): boolean;
}

type StorageValue = { [key: string]: string };

// OffscreenCanvas not yet available in TypeScript - 'transferControlToOffscreen' would not be
// detected as a Canvas method unless this is here
declare interface HTMLCanvasElement {
  transferControlToOffscreen(): Transferable;
}

interface Node {
  _index_: number;
}

type RenderableElement = (HTMLElement | SVGElement | Text | Comment) & {
  [index: string]: any;
};

declare const WORKER_DOM_DEBUG: boolean;
declare const IS_AMP: boolean;
