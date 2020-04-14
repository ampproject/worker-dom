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

import { Element } from './Element';
import { matchChildrenElements } from './matchElements';

/**
 * The HTMLInputLabels interface represents a collection of input getters for their related label Elements.
 * It is mixedin to both HTMLInputElement, HTMLMeterElement, and HTMLProgressElement.
 */
export const HTMLInputLabelsMixin = (defineOn: typeof Element): void => {
  Object.defineProperty(defineOn.prototype, 'labels', {
    /**
     * Getter returning label elements associated to this meter.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLProgressElement/labels
     * @return label elements associated to this meter.
     */
    get(): Array<Element> {
      return matchChildrenElements(
        ((this as Element).ownerDocument as Element) || this,
        (element) => element.tagName === 'LABEL' && element.for && element.for === (this as Element).id,
      );
    },
  });
};
