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
