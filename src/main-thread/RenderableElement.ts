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

/**
 * When Rendering Elements in the main thread, attach a required property containing
 * the numeric identifier for the element. This identifier is the key in Nodes for the Element (see Nodes.ts).
 *
 * This identifier is used to optimize the delivery of Node information across threads.
 * By referencing a known monotomically increasing counter as new Nodes are passed, we can reduce the amount
 * of transmission overhead by sending the identifier alone in some scenarios.
 */

interface RenderableHTMLElement extends HTMLElement {
  [key: string]: any;
  _index_: number;
}
interface RenderableSVGElement extends SVGElement {
  [key: string]: any;
  _index_: number;
}
interface RenderableText extends Text {
  [key: string]: any;
  _index_: number;
}
export type RenderableElement = RenderableHTMLElement | RenderableSVGElement | RenderableText;
