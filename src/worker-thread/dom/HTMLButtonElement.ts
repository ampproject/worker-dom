import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';

export class HTMLButtonElement extends HTMLElement {}
registerSubclass('button', HTMLButtonElement);

// Reflected properties, strings.
// HTMLButtonElement.formAction => string, reflected attribute
// HTMLButtonElement.formEnctype => string, reflected attribute
// HTMLButtonElement.formMethod => string, reflected attribute
// HTMLButtonElement.formTarget => string, reflected attribute
// HTMLButtonElement.name => string, reflected attribute
// HTMLButtonElement.type => string, reflected attribute (default submit)
// HTMLButtonElement.value => string, reflected attribute
// HTMLButtonElement.autofocus => boolean, reflected attribute
// HTMLButtonElement.disabled => boolean, reflected attribute
reflectProperties(
  [
    { formAction: [''] },
    { formEnctype: [''] },
    { formMethod: [''] },
    { formTarget: [''] },
    { name: [''] },
    { type: ['submit'] },
    { value: [''] },
    { autofocus: [false] },
    { disabled: [false] },
  ],
  HTMLButtonElement,
);

// Not reflected
// HTMLButtonElement.formNoValidate => boolean
// HTMLButtonElement.validity => ValidityState, readonly

// Unimplemented
// HTMLButtonElement.form => HTMLFormElement | null, readonly
// HTMLButtonElement.labels => Array<HTMLLabelElement>, readonly
// HTMLButtonElement.menu => HTMLMenuElement
// HTMLButtonElement.willValidate => boolean, readonly
// HTMLButtonElement.validationMessage => string, readonly
