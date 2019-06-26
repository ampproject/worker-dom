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

import anyTest, { TestInterface } from 'ava';
import { Env } from './helpers/env';
import { install } from '../../main-thread/install';
import { HydrateableNode, NodeType, HTML_NAMESPACE, SVG_NAMESPACE } from '../../transfer/TransferrableNodes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

const test = anyTest as TestInterface<{
  env: Env;
  baseElement: HTMLElement;
}>;

test.beforeEach(t => {
  const env = new Env();
  const { document } = env;
  const baseElement = document.createElement('div');
  document.body.appendChild(baseElement);

  t.context = {
    env,
    baseElement,
  };
});

test.afterEach(t => {
  t.context.env.dispose();
});

test.serial.cb('initialize an empty element', t => {
  const { baseElement } = t.context;

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
    onCreateWorker: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => {
      t.deepEqual(skeleton, {
        [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
        [TransferrableKeys.localOrNodeName]: strings.indexOf('div'),
        [TransferrableKeys.attributes]: [],
        [TransferrableKeys.childNodes]: [],
        [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
        [TransferrableKeys.index]: 2,
        [TransferrableKeys.transferred]: 0,
      });

      t.end();
    },
  }).then();
});

test.serial.cb('initialize a single element', t => {
  const { env, baseElement } = t.context;
  const div = env.document.createElement('div');
  baseElement.appendChild(div);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
    onCreateWorker: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => {
      t.deepEqual(skeleton, {
        [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
        [TransferrableKeys.localOrNodeName]: strings.indexOf('div'),
        [TransferrableKeys.attributes]: [],
        [TransferrableKeys.childNodes]: [
          {
            [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
            [TransferrableKeys.localOrNodeName]: strings.indexOf('div'),
            [TransferrableKeys.attributes]: [],
            [TransferrableKeys.childNodes]: [],
            [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
            [TransferrableKeys.index]: 3,
            [TransferrableKeys.transferred]: 0,
          },
        ],
        [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
        [TransferrableKeys.index]: 2,
        [TransferrableKeys.transferred]: 0,
      });

      t.end();
    },
  }).then();
});

test.serial.cb('initialize a single svg element', t => {
  const { env, baseElement } = t.context;
  const svg = env.document.createElementNS(SVG_NAMESPACE, 'svg');
  baseElement.appendChild(svg);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
    onCreateWorker: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => {
      t.deepEqual(skeleton, {
        [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
        [TransferrableKeys.localOrNodeName]: strings.indexOf('div'),
        [TransferrableKeys.attributes]: [],
        [TransferrableKeys.childNodes]: [
          {
            [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
            [TransferrableKeys.localOrNodeName]: strings.indexOf('svg'),
            [TransferrableKeys.attributes]: [],
            [TransferrableKeys.childNodes]: [],
            [TransferrableKeys.namespaceURI]: strings.indexOf(SVG_NAMESPACE),
            [TransferrableKeys.index]: 3,
            [TransferrableKeys.transferred]: 0,
          },
        ],
        [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
        [TransferrableKeys.index]: 2,
        [TransferrableKeys.transferred]: 0,
      });

      t.end();
    },
  }).then();
});

test.serial.cb('initialize a single text node', t => {
  const { env, baseElement } = t.context;
  const text = env.document.createTextNode('foo');
  baseElement.appendChild(text);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
    onCreateWorker: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => {
      t.deepEqual(skeleton, {
        [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
        [TransferrableKeys.localOrNodeName]: strings.indexOf('div'),
        [TransferrableKeys.attributes]: [],
        [TransferrableKeys.childNodes]: [
          {
            [TransferrableKeys.nodeType]: NodeType.TEXT_NODE,
            [TransferrableKeys.localOrNodeName]: strings.indexOf('#text'),
            [TransferrableKeys.attributes]: [],
            [TransferrableKeys.childNodes]: [],
            [TransferrableKeys.textContent]: strings.indexOf('foo'),
            [TransferrableKeys.index]: 3,
            [TransferrableKeys.transferred]: 0,
          },
        ],
        [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
        [TransferrableKeys.index]: 2,
        [TransferrableKeys.transferred]: 0,
      });

      t.end();
    },
  }).then();
});

test.serial.cb('initialize a single comment node', t => {
  const { env, baseElement } = t.context;
  const text = env.document.createComment('foo');
  baseElement.appendChild(text);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
    onCreateWorker: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => {
      t.deepEqual(skeleton, {
        [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
        [TransferrableKeys.localOrNodeName]: strings.indexOf('div'),
        [TransferrableKeys.attributes]: [],
        [TransferrableKeys.childNodes]: [
          {
            [TransferrableKeys.nodeType]: NodeType.COMMENT_NODE,
            [TransferrableKeys.localOrNodeName]: strings.indexOf('#comment'),
            [TransferrableKeys.attributes]: [],
            [TransferrableKeys.childNodes]: [],
            [TransferrableKeys.textContent]: strings.indexOf('foo'),
            [TransferrableKeys.index]: 3,
            [TransferrableKeys.transferred]: 0,
          },
        ],
        [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
        [TransferrableKeys.index]: 2,
        [TransferrableKeys.transferred]: 0,
      });

      t.end();
    },
  }).then();
});

test.serial.cb('initialize sibling elements', t => {
  const { env, baseElement } = t.context;
  const div = env.document.createElement('div');
  const span = env.document.createElement('span');
  baseElement.appendChild(div);
  baseElement.appendChild(span);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
    onCreateWorker: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => {
      t.deepEqual(skeleton, {
        [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
        [TransferrableKeys.localOrNodeName]: strings.indexOf('div'),
        [TransferrableKeys.attributes]: [],
        [TransferrableKeys.childNodes]: [
          {
            [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
            [TransferrableKeys.localOrNodeName]: strings.indexOf('div'),
            [TransferrableKeys.attributes]: [],
            [TransferrableKeys.childNodes]: [],
            [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
            [TransferrableKeys.index]: 3,
            [TransferrableKeys.transferred]: 0,
          },
          {
            [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
            [TransferrableKeys.localOrNodeName]: strings.indexOf('span'),
            [TransferrableKeys.attributes]: [],
            [TransferrableKeys.childNodes]: [],
            [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
            [TransferrableKeys.index]: 4,
            [TransferrableKeys.transferred]: 0,
          },
        ],
        [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
        [TransferrableKeys.index]: 2,
        [TransferrableKeys.transferred]: 0,
      });

      t.end();
    },
  }).then();
});

test.serial.cb('initialize sibling text nodes', t => {
  const { env, baseElement } = t.context;
  const text = env.document.createTextNode('foo');
  const textTwo = env.document.createTextNode('bar');
  baseElement.appendChild(text);
  baseElement.appendChild(textTwo);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
    onCreateWorker: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => {
      t.deepEqual(skeleton, {
        [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
        [TransferrableKeys.localOrNodeName]: strings.indexOf('div'),
        [TransferrableKeys.attributes]: [],
        [TransferrableKeys.childNodes]: [
          {
            [TransferrableKeys.nodeType]: NodeType.TEXT_NODE,
            [TransferrableKeys.localOrNodeName]: strings.indexOf('#text'),
            [TransferrableKeys.attributes]: [],
            [TransferrableKeys.childNodes]: [],
            [TransferrableKeys.textContent]: strings.indexOf('foo'),
            [TransferrableKeys.index]: 3,
            [TransferrableKeys.transferred]: 0,
          },
          {
            [TransferrableKeys.nodeType]: NodeType.TEXT_NODE,
            [TransferrableKeys.localOrNodeName]: strings.indexOf('#text'),
            [TransferrableKeys.attributes]: [],
            [TransferrableKeys.childNodes]: [],
            [TransferrableKeys.textContent]: strings.indexOf('bar'),
            [TransferrableKeys.index]: 4,
            [TransferrableKeys.transferred]: 0,
          },
        ],
        [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
        [TransferrableKeys.index]: 2,
        [TransferrableKeys.transferred]: 0,
      });

      t.end();
    },
  }).then();
});

test.serial.cb('initialize sibling comment nodes', t => {
  const { env, baseElement } = t.context;
  const comment = env.document.createComment('foo');
  const commentTwo = env.document.createComment('bar');
  baseElement.appendChild(comment);
  baseElement.appendChild(commentTwo);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
    onCreateWorker: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => {
      t.deepEqual(skeleton, {
        [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
        [TransferrableKeys.localOrNodeName]: strings.indexOf('div'),
        [TransferrableKeys.attributes]: [],
        [TransferrableKeys.childNodes]: [
          {
            [TransferrableKeys.nodeType]: NodeType.COMMENT_NODE,
            [TransferrableKeys.localOrNodeName]: strings.indexOf('#comment'),
            [TransferrableKeys.attributes]: [],
            [TransferrableKeys.childNodes]: [],
            [TransferrableKeys.textContent]: strings.indexOf('foo'),
            [TransferrableKeys.index]: 3,
            [TransferrableKeys.transferred]: 0,
          },
          {
            [TransferrableKeys.nodeType]: NodeType.COMMENT_NODE,
            [TransferrableKeys.localOrNodeName]: strings.indexOf('#comment'),
            [TransferrableKeys.attributes]: [],
            [TransferrableKeys.childNodes]: [],
            [TransferrableKeys.textContent]: strings.indexOf('bar'),
            [TransferrableKeys.index]: 4,
            [TransferrableKeys.transferred]: 0,
          },
        ],
        [TransferrableKeys.namespaceURI]: strings.indexOf(HTML_NAMESPACE),
        [TransferrableKeys.index]: 2,
        [TransferrableKeys.transferred]: 0,
      });

      t.end();
    },
  }).then();
});
