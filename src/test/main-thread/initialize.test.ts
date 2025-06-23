import anyTest, { TestFn } from 'ava';
import { Env } from './helpers/env.js';
import { install } from '../../main-thread/install.js';
import { HydrateableNode, NodeType, HTML_NAMESPACE, SVG_NAMESPACE } from '../../transfer/TransferrableNodes.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';

const test = anyTest as TestFn<{
  env: Env;
  baseElement: HTMLElement;
}>;

test.beforeEach((t) => {
  const env = new Env();
  const { document } = env;
  const baseElement = document.createElement('div');
  document.body.appendChild(baseElement);

  t.context = {
    env,
    baseElement,
  };
});

test.afterEach((t) => {
  t.context.env.dispose();
});

test.serial('initialize an empty element', async (t) => {
  const { baseElement } = t.context;

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  
  return new Promise<void>((resolve) => {
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

        resolve();
      },
    });
  });
});

test.serial('initialize a single element', async (t) => {
  const { env, baseElement } = t.context;
  const div = env.document.createElement('div');
  baseElement.appendChild(div);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  
  return new Promise<void>((resolve) => {
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

        resolve();
      },
    });
  });
});

test.serial('initialize a single svg element', async (t) => {
  const { env, baseElement } = t.context;
  const svg = env.document.createElementNS(SVG_NAMESPACE, 'svg');
  baseElement.appendChild(svg);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  
  return new Promise<void>((resolve) => {
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

        resolve();
      },
    });
  });
});

test.serial('initialize a single text node', async (t) => {
  const { env, baseElement } = t.context;
  const text = env.document.createTextNode('foo');
  baseElement.appendChild(text);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  
  return new Promise<void>((resolve) => {
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

        resolve();
      },
    });
  });
});

test.serial('initialize a single comment node', async (t) => {
  const { env, baseElement } = t.context;
  const text = env.document.createComment('foo');
  baseElement.appendChild(text);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  
  return new Promise<void>((resolve) => {
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

        resolve();
      },
    });
  });
});

test.serial('initialize sibling elements', async (t) => {
  const { env, baseElement } = t.context;
  const div = env.document.createElement('div');
  const span = env.document.createElement('span');
  baseElement.appendChild(div);
  baseElement.appendChild(span);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  return new Promise<void>((resolve) => {
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

        resolve();
      },
    });
  });
});

test.serial('initialize sibling text nodes', async (t) => {
  const { env, baseElement } = t.context;
  const text = env.document.createTextNode('foo');
  const textTwo = env.document.createTextNode('bar');
  baseElement.appendChild(text);
  baseElement.appendChild(textTwo);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  
  return new Promise<void>((resolve) => {
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

        resolve();
      },
    });
  });
});

test.serial('initialize sibling comment nodes', async (t) => {
  const { env, baseElement } = t.context;
  const comment = env.document.createComment('foo');
  const commentTwo = env.document.createComment('bar');
  baseElement.appendChild(comment);
  baseElement.appendChild(commentTwo);

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  return new Promise<void>((resolve) => {
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

        resolve();
      },
    });
  });
});
