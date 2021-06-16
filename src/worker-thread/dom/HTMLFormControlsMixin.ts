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
import { matchChildrenElements, tagNameConditionPredicate } from './matchElements';

const MATCHING_CHILD_ELEMENT_TAGNAMES = 'BUTTON FIELDSET INPUT OBJECT OUTPUT SELECT TEXTAREA'.split(' ');

/**
 * The HTMLFormControlsCollection interface represents a collection of HTML form control elements.
 * It is mixedin to both HTMLFormElement and HTMLFieldSetElement.
 */
export const HTMLFormControlsCollectionMixin = (defineOn: typeof Element): void => {
  Object.defineProperty(defineOn.prototype, 'elements', {
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
     * @return Element array matching children of specific tagnames.
     */
    get(): Array<Element> {
      return matchChildrenElements(this as Element, tagNameConditionPredicate(MATCHING_CHILD_ELEMENT_TAGNAMES));
    },
  });
};
