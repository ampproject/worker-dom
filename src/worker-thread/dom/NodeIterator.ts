import { Node } from "./Node";

export const NodeFilter = {
    FILTER_ACCEPT: 1,
    FILTER_REJECT: 2,
    FILTER_SKIP: 3,
    SHOW_ALL: 0xFFFFFFFF,
    SHOW_ELEMENT: 0x1,
    SHOW_ATTRIBUTE: 0x2,
    SHOW_TEXT: 0x4, 
}

export class NodeIterator {
    private currentNode: Node;
    private root: Node;
    private whatToShow: number;
    private filter: ((node: Node) => number) | null;

    constructor(root: Node, whatToShow: number = NodeFilter.SHOW_ALL, filter: ((node: Node) => number) | null = null) {
        this.currentNode = root;
        this.root = root;
        this.whatToShow = whatToShow;
        this.filter = filter;
    }

    nextNode(): Node | null {
        let next = this._nextNode(this.currentNode);
        while (next) {
            if (this._acceptNode(next) === NodeFilter.FILTER_ACCEPT) {
                this.currentNode = next;
                return next;
            }
            next = this._nextNode(next);
        }
        return null;
    }

    private _nextNode(node: Node): Node | null {
        if (node.firstChild) {
            return node.firstChild;
        }
        while (node) {
            if (node === this.root) {
                return null;
            }
            if (node.nextSibling) {
                return node.nextSibling;
            }
            (node as Node | null) = node.parentNode;
        }
        return null;
    }

    private _acceptNode(node: Node): number {
        if ((this.whatToShow & (1 << node.nodeType - 1)) === 0) {
            return NodeFilter.FILTER_REJECT;
        }
        if (this.filter) {
            return this.filter(node);
        }
        return NodeFilter.FILTER_ACCEPT;
    }

    previousNode(): Node | null {
        let prev = this._previousNode(this.currentNode);
        while (prev) {
            if (this._acceptNode(prev) === NodeFilter.FILTER_ACCEPT) {
                this.currentNode = prev;
                return prev;
            }
            prev = this._previousNode(prev);
        }
        return null;
    }

    private _previousNode(node: Node): Node | null {
        if (node === this.root) {
            return null;
        }
        if (node.previousSibling) {
            node = node.previousSibling;
            while (node.lastChild) {
                node = node.lastChild;
            }
            return node;
        }
        return node.parentNode;
    }
}


