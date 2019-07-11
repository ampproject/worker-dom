/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NodeType, TransferrableNodeIndex } from '../transfer/TransferrableNodes';
import { StringContext } from './strings';

export class NodeContext {
  public baseElement: HTMLElement;
  private stringContext: StringContext;
  private count: number;
  private nodes: Map<number, Node>;

  /**
   * Called when initializing a Worker, ensures the nodes in baseElement are
   * known for transmission into the Worker and future mutation events from the
   * Worker.
   * @param baseElement Element that will be controlled by a Worker
   */
  constructor(stringContext: StringContext, baseElement: Element) {
    this.count = 2;
    this.stringContext = stringContext;

    // The nodes map is populated with two default values pointing to baseElement.
    // These are [document, document.body] from the worker.
    this.nodes = new Map([[1, baseElement], [2, baseElement]]);
    this.baseElement = baseElement as HTMLElement;
    // To ensure a lookup works correctly from baseElement
    // add an index equal to the background thread document.body.
    baseElement._index_ = 2;
    // Lastly, it's important while initializing the document that we store
    // the default nodes present in the server rendered document.
    baseElement.childNodes.forEach(n => this.storeNodes(n));
  }

  public createNodes = (buffer: ArrayBuffer, sanitizer?: Sanitizer): void => {
    const nodeBuffer = new Uint16Array(buffer);
    const nodeBufferLength = nodeBuffer.length;

    for (let iterator = 0; iterator < nodeBufferLength; iterator += TransferrableNodeIndex.End) {
      let node: Node;
      if (nodeBuffer[iterator + TransferrableNodeIndex.NodeType] === NodeType.TEXT_NODE) {
        node = document.createTextNode(this.stringContext.get(nodeBuffer[iterator + TransferrableNodeIndex.TextContent]));
      } else if (nodeBuffer[iterator + TransferrableNodeIndex.NodeType] === NodeType.COMMENT_NODE) {
        node = document.createComment(this.stringContext.get(nodeBuffer[iterator + TransferrableNodeIndex.TextContent]));
      } else if (nodeBuffer[iterator + TransferrableNodeIndex.NodeType] === NodeType.DOCUMENT_FRAGMENT_NODE) {
        node = document.createDocumentFragment();
      } else {
        const nodeName = this.stringContext.get(nodeBuffer[iterator + TransferrableNodeIndex.NodeName]);
        node =
          nodeBuffer[iterator + TransferrableNodeIndex.Namespace] !== 0
            ? document.createElementNS(this.stringContext.get(nodeBuffer[iterator + TransferrableNodeIndex.Namespace]), nodeName)
            : document.createElement(nodeName);

        // TODO(KB): Restore Properties
        // skeleton.properties.forEach(property => {
        //   node[`${property.name}`] = property.value;
        // });
        // ((skeleton as TransferrableElement)[TransferrableKeys.childNodes] || []).forEach(childNode => {
        //   if (childNode[TransferrableKeys.transferred] === NumericBoolean.FALSE) {
        //     node.appendChild(this.createNode(childNode as TransferrableNode));
        //   }
        // });

        // If `node` is removed by the sanitizer, don't store it and return null.
        if (sanitizer && !sanitizer.sanitize(node)) {
          continue;
        }
      }

      this.storeNode(node, nodeBuffer[iterator]);
    }
  };

  /**
   * Returns the real DOM Element corresponding to a serialized Element object.
   * @param id
   * @return RenderableElement | null
   */
  public getNode = (id: number): RenderableElement | null => {
    const node = this.nodes.get(id);

    if (node && node.nodeName === 'BODY') {
      // If the node requested is the "BODY"
      // Then we return the base node this specific <amp-script> comes from.
      // This encapsulates each <amp-script> node.
      return this.baseElement as RenderableElement;
    }
    return node as RenderableElement;
  };

  /**
   * Store the requested node and all of its children.
   * @param node node to store.
   */
  private storeNodes = (node: Node): void => {
    this.storeNode(node, ++this.count);
    node.childNodes.forEach(n => this.storeNodes(n));
  };

  /**
   * Establish link between DOM `node` and worker-generated identifier `id`.
   *
   * These _shouldn't_ collide between instances of <amp-script> since
   * each element creates it's own pool on both sides of the worker
   * communication bridge.
   * @param node
   * @param id
   */
  private storeNode(node: Node, id: number): void {
    (node as Node)._index_ = id;
    this.nodes.set(id, node as Node);
  }
}
