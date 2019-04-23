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

import { HTMLElement } from './HTMLElement';
import { registerSubclass } from './Element';
import { reflectProperties } from './enhanceElement';
import { CanvasRenderingContext2DImplementation } from '../CanvasRenderingContext2D';

export class HTMLCanvasElement extends HTMLElement {
  private context: CanvasRenderingContext2DImplementation<HTMLCanvasElement>;

  getContext(contextType: string): CanvasRenderingContext2DImplementation<HTMLCanvasElement> {
    if (!this.context) {
      if (contextType === '2D' || contextType === '2d') {
        this.context = new CanvasRenderingContext2DImplementation<HTMLCanvasElement>(this);
      } else {
        throw new Error('Context type not supported.');
      }
    }
    return this.context;
  }
}
registerSubclass('canvas', HTMLCanvasElement);

reflectProperties([{ height: [0] }, { width: [0] }], HTMLCanvasElement);

// Unimplemented Properties
// HTMLCanvasElement.mozOpaque => boolean
// HTMLCanvasElement.mozPrintCallback => function

// Unimplemented Methods
// HTMLCanvasElement.captureStream()
// HTMLCanvasElement.toDataURL()
// HTMLCanvasElement.toBlob()
// HTMLCanvasElement.transferControlToOffscreen()
// HTMLCanvasElement.mozGetAsFile()
