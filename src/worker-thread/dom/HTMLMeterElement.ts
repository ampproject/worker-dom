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

import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { HTMLInputLabelsMixin } from './HTMLInputLabelsMixin';

export class HTMLMeterElement extends HTMLElement {}
registerSubclass('meter', HTMLMeterElement);
HTMLInputLabelsMixin(HTMLMeterElement);

// Reflected Properties
// HTMLMeterElement.high => number, reflected attribute
// HTMLMeterElement.low => number, reflected attribute
// HTMLMeterElement.max => number, reflected attribute
// HTMLMeterElement.min => number, reflected attribute
// HTMLMeterElement.optimum => number, reflected attribute
// HTMLMeterElement.value => number, reflected attribute
reflectProperties([{ high: [0] }, { low: [0] }, { max: [1] }, { min: [0] }, { optimum: [0] }, { value: [0] }], HTMLMeterElement);
