import { HTMLElement } from './dom/HTMLElement';
import { SVGElement } from './dom/SVGElement';
import { Text } from './dom/Text';
import { Comment } from './dom/Comment';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { Document } from './dom/Document';

type RenderableElement = HTMLElement | SVGElement | Text | Comment;
type PostMessage = (message: any, transfer?: Transferable[]) => void;

type SerializableType = TransferrableObject | number | string | boolean | undefined | Document | typeof globalThis;
type Serializable = SerializableType | SerializableType[];

export interface TransferrableObject {
  /**
   * Retrieves an array of values that allow the retrieval of a specific object in the main thread.
   */
  [TransferrableKeys.serializeAsTransferrableObject](): number[];
}
