import { Node } from './Node';

export abstract class NodeFilter {
  public static readonly FILTER_ACCEPT = 1;
  public static readonly FILTER_REJECT = 2;
  public static readonly FILTER_SKIP = 3;

  public static readonly SHOW_ALL = 4294967295;
  public static readonly SHOW_ELEMENT = 1;
  public static readonly SHOW_TEXT = 4;
  public static readonly SHOW_PROCESSING_INSTRUCTION = 64;
  public static readonly SHOW_COMMENT = 128;
  public static readonly SHOW_DOCUMENT = 256;
  public static readonly SHOW_DOCUMENT_TYPE = 512;
  public static readonly SHOW_DOCUMENT_FRAGMENT = 1024;
}

export interface NodeFilter {
  acceptNode(node: Node): number;
}
