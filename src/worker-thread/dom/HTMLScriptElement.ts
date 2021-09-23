import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';

export class HTMLScriptElement extends HTMLElement {
  /**
   * A Synonym for the Node.textContent property getter.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
   * @return value of text node direct child of this Element.
   */
  get text(): string {
    return this.textContent;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
   * @param text new text content to store for this Element.
   */
  set text(text: string) {
    this.textContent = text;
  }
}
registerSubclass('script', HTMLScriptElement);

// Reflected Properties
// HTMLScriptElement.type => string, reflected attribute
// HTMLScriptElement.src => string, reflected attribute
// HTMLScriptElement.charset => string, reflected attribute
// HTMLScriptElement.async => boolean, reflected attribute
// HTMLScriptElement.defer => boolean, reflected attribute
// HTMLScriptElement.crossOrigin => string, reflected attribute
// HTMLScriptElement.noModule => boolean, reflected attribute
reflectProperties(
  [{ type: [''] }, { src: [''] }, { charset: [''] }, { async: [false] }, { defer: [false] }, { crossOrigin: [''] }, { noModule: [false] }],
  HTMLScriptElement,
);
