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
        checkMatch(t, path);
      },
      Literal(path) {
        checkMatch(t, path);
      },
    },
  };
}


/**
 * @param {Types} t
 * @param {Literal|Identifier} path
 */
function checkMatch(t, path) {
  const { node, parent, parentKey, parentPath, scope } = path;
  if (!node || !parent) {
    return;
  }
  const isLiteral = t.isLiteral(node);
  const name = isLiteral ? node.value : node.name;
  if (!name) {
    return;
  }
  const spec = DICT[name];
  if (!spec) {
    return;
  }

  const hasBinding = isLiteral ? false : scope.hasBinding(name);
  const parentOfParentPath = parentPath && parentPath.parentPath;
  const parentOfParent = parentOfParentPath && parentOfParentPath.node;

  const filtered =
      // Member properties and function calls.
      // `btn.offsetWidth`, `btn.getBoundingClientRect()`
      // `btn['offsetWidth']`, `btn['getBoundingClientRect']()`
      (t.isMemberExpression(parent, {property: node})
       && !hasBinding)
      ||
      // Object property pattern in declaration.
      // `const {offsetWidth} = btn`
      // `const {'offsetWidth': x} = btn`
      (t.isObjectProperty(parent, {key: node})
       && t.isObjectPattern(parentOfParent))
      ||
      // Global function calls.
      // `getComputedStyle()`
      (!isLiteral
       && spec.global
       && t.isCallExpression(parent, {callee: node})
       && !hasBinding)
      ||
      // Global property reads.
      // `x = pageXOffset`
      (!isLiteral
       && spec.global
       && path.isReferencedIdentifier()
       && !hasBinding);

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
