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

declare interface DOMPurify {
  addHook(entryPoint: string, hookFunction?: Function): void;
  isValidAttribute(tag: string, attr: string, value: string): boolean;
  removeAllHooks(): void;
  sanitize(dirty: string | Node, cfg: Object): string | Node;
}

declare module 'dompurify' {
  var purify: DOMPurify;
  export default purify;
}

declare interface Sanitizer {
  sanitize(node: Node): boolean;
  validAttribute(tag: string, attr: string, value: string): boolean;
  validProperty(tag: string, prop: string, value: string): boolean;
}

declare interface HTMLCanvasElement {
  transferControlToOffscreen(): Transferable;
}

interface Node {
  _index_: number;
}

type RenderableElement = (HTMLElement | SVGElement | Text | Comment) & { [index: string]: any };

declare const DEBUG_ENABLED: boolean;
