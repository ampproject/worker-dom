import { keyValueString } from '../../utils';
import { NamespaceURI } from './Node';

export interface Attr {
  [index: string]: string | null;
  namespaceURI: NamespaceURI;
  name: string;
  value: string;
}

export const toString = (attributes: Attr[]): string => attributes.map((attr: Attr) => keyValueString(attr.name, attr.value)).join(' ');
export const matchPredicate =
  (namespaceURI: NamespaceURI, name: string): ((attr: Attr) => boolean) =>
  (attr) =>
    attr.namespaceURI === namespaceURI && attr.name === name;
