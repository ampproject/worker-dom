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

module.exports = function({ types: t }) {
  return {
    visitor: {
      /**
       * Global function calls and property reads, such as:
       *  - `getComputedStyle()`
       *  - `x = pageXOffset`
       */
      ReferencedIdentifier(path) {
        const { node, parent, parentPath, scope } = path;
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
        if (hasOkComment(node, parent, parentPath.parent)) {
          return;
        }

        const hasBinding = scope.hasBinding(name);
        const filtered =
          // Global function calls.
          // `getComputedStyle()`
          (spec.global && t.isCallExpression(parent, { callee: node }) && !hasBinding) ||
          // Global property reads.
          // `x = pageXOffset`
          (spec.global && path.isReferencedIdentifier() && !hasBinding);
        if (filtered) {
          report(path, name, spec);
        }
      },

      /**
       * Member properties and function calls, such as:
       *  - `btn.offsetWidth`
       *  - `btn.getBoundingClientRect()`
       *  - `btn['offsetWidth']`
       *  - `btn['getBoundingClientRect']()`
       */
      MemberExpression(path) {
        const { node, parent } = path;
        if (!node || !parent) {
          return;
        }
        const { property } = node;
        if (!property) {
          return;
        }
        const name = t.isStringLiteral(property) ? property.value : t.isIdentifier(property) ? property.name : null;
        if (!name) {
          return;
        }
        const spec = DICT[name];
        if (!spec) {
          return;
        }
        if (hasOkComment(property)) {
          return;
        }
        if (t.isIdentifier(property) && node.computed) {
          return;
        }
        report(path, name, spec);
      },

      /**
       * Object property pattern in declaration, such as:
       *  - `const {offsetWidth} = btn`
       *  - `const {'offsetWidth': x} = btn`
       */
      ObjectPattern(path) {
        const { node, parent } = path;
        if (!node || !parent) {
          return;
        }
        const { properties } = node;
        if (!properties || properties.length == 0) {
          return;
        }

        for (let i = 0; i < properties.length; i++) {
          const property = properties[i];
          const { key } = property;
          if (!key) {
            continue;
          }
          const name = t.isStringLiteral(key) ? key.value : t.isIdentifier(key) ? key.name : null;
          if (!name) {
            continue;
          }
          const spec = DICT[name];
          if (!spec) {
            continue;
          }
          if (hasOkComment(property)) {
            continue;
          }
          if (t.isIdentifier(key) && property.computed) {
            continue;
          }
          report(path, name, spec);
        }
      },
    },
  };
};

/**
 * @param {!Path} path
 * @param {string} name
 * @param {!Object} spec
 */
function report(path, name, spec) {
  const message = `Cannot use '${name}' in WorkerDOM directly.` + (spec.replacement ? ` Use '${spec.replacement}' instead.` : '');
  const error = path.buildCodeFrameError(message, TypeError);
  if (console.test) {
    console.test(error);
  } else {
    console.warn(error);
  }
}

/**
 * @param {...} var_args
 * @return {boolean}
 */
function hasOkComment(var_args) {
  for (let i = 0; i < arguments.length; i++) {
    const node = arguments[i];
    if (!node || !node.leadingComments || node.leadingComments.length == 0) {
      continue;
    }
    for (let i = 0; i < node.leadingComments.length; i++) {
      if (node.leadingComments[i].value.trim() == 'OK') {
        return true;
      }
    }
  }
  return false;
}
