import { registerSubclass, definePropertyBackedAttributes } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { DOMTokenList } from './DOMTokenList';

export class HTMLIFrameElement extends HTMLElement {
  private _sandbox: DOMTokenList;

  // HTMLIFrameElement.sandbox, DOMTokenList, reflected attribute
  public get sandbox(): DOMTokenList {
    return this._sandbox || (this._sandbox = new DOMTokenList(this, 'sandbox'));
  }
}
registerSubclass('iframe', HTMLIFrameElement);
definePropertyBackedAttributes(HTMLIFrameElement, {
  sandbox: [(el): string | null => el.sandbox.value, (el, value: string) => (el.sandbox.value = value)],
});
// Reflected properties
// HTMLIFrameElement.allow => string, reflected attribute
// HTMLIFrameElement.allowFullscreen => boolean, reflected attribute
// HTMLIFrameElement.csp => string, reflected attribute
// HTMLIFrameElement.height => string, reflected attribute
// HTMLIFrameElement.name => string, reflected attribute
// HTMLIFrameElement.referrerPolicy => string, reflected attribute
// HTMLIFrameElement.src => string, reflected attribute
// HTMLIFrameElement.srcdoc => string, reflected attribute
// HTMLIFrameElement.width => string, reflected attribute
reflectProperties(
  [
    { allow: [''] },
    { allowFullscreen: [false] },
    { csp: [''] },
    { height: [''] },
    { name: [''] },
    { referrerPolicy: [''] },
    { src: [''] },
    { srcdoc: [''] },
    { width: [''] },
  ],
  HTMLIFrameElement,
);

// Unimplemented Properties
// HTMLIFrameElement.allowPaymentRequest => boolean, reflected attribute
// HTMLIFrameElement.contentDocument => Document, read only (active document in the inline frame's nested browsing context)
// HTMLIFrameElement.contentWindow => WindowProxy, read only (window proxy for the nested browsing context)
