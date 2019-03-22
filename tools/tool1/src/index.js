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

const DICT = require('./dict');


module.exports = function({types: t}) {
  return {
    visitor: {
      Identifier(path) {
        const { node, parent, parentKey, parentPath } = path;
        if (!node || !parent) {
          return;
        }
        const { name } = node;
        if (!name) {
          return;
        }
        const spec = DICT[name];
        if (!spec) {
          return;
        }

        const filtered =
            // Member properties and function calls.
            (!spec.global
             && parent.type == 'MemberExpression'
             && parentKey == 'property')
            ||
            // Global function calls.
            (spec.global
             && parent.type == 'CallExpression'
             && parentKey == 'callee')
            ||
            // Global property reads.
            (spec.global
             && path.isReferencedIdentifier());

        // Max depth is 3 for a function call.
        const hasOk = hasOkComment(node)
            || hasOkComment(parentPath && parentPath.node)
            || hasOkComment(parentPath && parentPath.parentPath
                  && parentPath.parentPath.node);

        if (filtered && !hasOk) {
          const message =
              `Cannot use '${name}' in WorkerDOM directly.`
              + (spec.replacement ? ` Use '${spec.replacement}' instead.` : '');
          console.warn(path.buildCodeFrameError(message, TypeError));
        }
      },
    },
  };
}


/**
 * @param {} node
 * @return {boolean}
 */
function hasOkComment(node) {
  return node
      && node.leadingComments
      && node.leadingComments.length > 0
      && node.leadingComments[0].value == 'OK'
      || false;
}
