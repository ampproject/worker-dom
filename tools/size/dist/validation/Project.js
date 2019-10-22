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
Object.defineProperty(exports, '__esModule', { value: true });
const fs_1 = require('../fs');
const path_1 = require('path');
const kleur_1 = require('kleur');
const Project = context => {
  return async function() {
    const projectPath = path_1.resolve(context.project);
    const packagePath = path_1.resolve(context.project, 'package.json');
    if (!(await fs_1.isDirectory(projectPath))) {
      return [false, kleur_1.bgRed('[ ERROR ]') + kleur_1.red(`Invalid project specified '${context.project}', is this a valid project?`)];
    }
    if (!(await fs_1.isFile(packagePath))) {
      return [false, kleur_1.bgRed('[ ERROR ]') + kleur_1.red(`Missing '${packagePath}', is this a valid project?`)];
    }
    context.project = projectPath;
    context.package = packagePath;
    return [true, null];
  };
};
exports.default = Project;
//# sourceMappingURL=Project.js.map
