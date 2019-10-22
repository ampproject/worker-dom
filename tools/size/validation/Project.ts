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

import { ConditionFunction, Context } from './Condition';
import { isDirectory, isFile } from '../fs';
import { resolve } from 'path';
import { bgRed, red } from 'kleur';

const Project: ConditionFunction = (context: Context) => {
  return async function() {
    const projectPath: string = resolve(context.project);
    const packagePath: string = resolve(context.project, 'package.json');

    if (!(await isDirectory(projectPath))) {
      return [false, bgRed('[ ERROR ]') + red(`Invalid project specified '${context.project}', is this a valid project?`)];
    }
    if (!(await isFile(packagePath))) {
      return [false, bgRed('[ ERROR ]') + red(`Missing '${packagePath}', is this a valid project?`)];
    }

    context.project = projectPath;
    context.package = packagePath;
    return [true, null];
  };
};

export default Project;
