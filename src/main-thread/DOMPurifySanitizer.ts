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

import purify from 'dompurify';

const propertyToAttribute: { [key: string]: string } = {}; // TODO(choumx): Fill this in.

/**
 * Object containing optional callbacks. Use this to configure
 * DOMPurify hooks before/after sanitization.
 * @see https://github.com/cure53/DOMPurify#hooks
 */
interface DOMPurifySanitizerCallbacks {
  afterSanitize?: (purify: DOMPurify) => void;
  beforeSanitize?: (purify: DOMPurify) => void;
  nodeWasRemoved?: (node: Node) => void;
}

export class DOMPurifySanitizer implements Sanitizer {
  callbacks_: DOMPurifySanitizerCallbacks;
  config_: Object;
  wrapper_: HTMLElement;

  constructor() {
    this.config_ = {};
    this.wrapper_ = document.createElement('div');
  }

  /**
   * @param config https://github.com/cure53/DOMPurify#can-i-configure-it
   * @param callbacks
   */
  configure(config: Object, callbacks: DOMPurifySanitizerCallbacks) {
    this.config_ = config;
    this.callbacks_ = callbacks;
  }

  /**
   * @param node
   * @return False if node was removed during sanitization. Otherwise, true.
   */
  sanitize(node: Node): boolean {
    if (this.callbacks_ && this.callbacks_.beforeSanitize) {
      this.callbacks_.beforeSanitize(purify);
    }
    // DOMPurify sanitizes unsafe nodes by detaching them from parents.
    // So, if `node` itself is unsafe and has no parent: runtime error.
    // To avoid this, wrap `node` in a div if it has no parent.
    const useWrapper = !node.parentNode;
    if (useWrapper) {
      this.wrapper_.appendChild(node);
    }
    const parent = node.parentNode || this.wrapper_;
    purify.sanitize(parent, Object.assign({}, this.config_, { IN_PLACE: true }));
    const clean = parent.firstChild;
    if (!clean) {
      if (this.callbacks_ && this.callbacks_.nodeWasRemoved) {
        this.callbacks_.nodeWasRemoved(node);
      }
      return false;
    }
    // Detach `node` if we used a wrapper div.
    if (useWrapper) {
      while (this.wrapper_.firstChild) {
        this.wrapper_.removeChild(this.wrapper_.firstChild);
      }
    }
    if (this.callbacks_ && this.callbacks_.afterSanitize) {
      this.callbacks_.afterSanitize(purify);
    }
    return true;
  }

  /**
   * @param tag
   * @param attr
   * @param value
   */
  validAttribute(tag: string, attr: string, value: string): boolean {
    return purify.isValidAttribute(tag, attr, value);
  }

  /**
   * @param tag
   * @param prop
   * @param value
   */
  validProperty(tag: string, prop: string, value: string): boolean {
    const attr = propertyToAttribute[prop];
    if (attr) {
      return this.validAttribute(tag, attr, value);
    } else {
      return this.validAttribute(tag, prop, value);
    }
  }
}
