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

        const parentOfParentPath = parentPath && parentPath.parentPath;
        const parentOfParentType =
            parentOfParentPath && parentOfParentPath.node.type;

        const filtered =
            // Member properties and function calls.
            // `btn.offsetWidth`, `btn.getBoundingClientRect()`
            (parent.type == 'MemberExpression'
             && parentKey == 'property')
            ||
            // Object property pattern in declaration.
            // `const {offsetWidth} = btn`
            (parent.type == 'ObjectProperty'
             && parentKey == 'key'
             && !path.isReferencedIdentifier()
             && parentOfParentType == 'ObjectPattern')
            ||
            // Global function calls.
            // `getComputedStyle()`
            (spec.global
             && parent.type == 'CallExpression'
             && parentKey == 'callee'
             && !path.scope.hasBinding(name))
            ||
            // Global property reads.
            // `x = pageXOffset`
            (spec.global
             && path.isReferencedIdentifier()
             && !path.scope.hasBinding(name));

        // Max depth is 3 for a function call.
        const hasOk = hasOkComment(node)
            || hasOkComment(parentPath && parentPath.node)
            || hasOkComment(parentOfParentPath && parentOfParentPath.node);

        if (filtered && !hasOk) {
          const message =
              `Cannot use '${name}' in WorkerDOM directly.`
              + (spec.replacement ? ` Use '${spec.replacement}' instead.` : '');
          const error = path.buildCodeFrameError(message, TypeError);
          if (console.test) {
            console.test(error);
          } else {
            console.warn(error);
          }
        }
      },
    },
  };
}


/**
 * @param node
 * @return {boolean}
 */
function hasOkComment(node) {
  if (!node
      || !node.leadingComments
      || node.leadingComments.length == 0) {
    return false;
  }
  for (let i = 0; i < node.leadingComments.length; i++) {
    if (node.leadingComments[i].value == 'OK') {
      return true;
    }
  }
  return false;
}
