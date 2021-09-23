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
