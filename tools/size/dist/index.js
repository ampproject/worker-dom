'use strict';
/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const mri = require('mri');
const Project_1 = __importDefault(require('./validation/Project'));
const Config_1 = __importDefault(require('./validation/Config'));
const compress_1 = __importDefault(require('./compress'));
const args = mri(process.argv.slice(2), {
  alias: { p: 'project' },
  default: { project: './' },
});
(async function() {
  const { project } = args;
  const conditions = [Project_1.default, Config_1.default];
  let context = {
    project,
    package: '',
    config: [],
  };
  for (const condition of conditions) {
    const [success, message] = await condition(context)();
    if (!success) {
      console.log(message);
      process.exit();
    }
  }
  await compress_1.default(context);
})();
//# sourceMappingURL=index.js.map
