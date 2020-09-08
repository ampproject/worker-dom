import anyTest, { TestInterface } from 'ava';
import { createTestingDocument } from '../DocumentCreation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { NodeType, HydrateableNode, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
import { Document } from '../../worker-thread/dom/Document';

const test = anyTest as TestInterface<{
  document: Document;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  t.context = { document };
});

test('supports hydrating a node with a value attribute', (t) => {
  const { document } = t.context;

  ['input', 'progress'].forEach((nodeName) => {
    let { node, strings } = getHydratableInputNode(nodeName, '42');
    const hydratedNode = document[TransferrableKeys.hydrateNode](strings, node);

    const expected = nodeName === 'input' ? '42' : 42;
    t.is(hydratedNode.value, expected);
  });
});

function getHydratableInputNode(localOrNodeName: string, value: string): { node: HydrateableNode; strings: Array<string> } {
  const strings = [localOrNodeName, '', HTML_NAMESPACE, 'value', value];
  return {
    node: {
      [TransferrableKeys.index]: 0,
      [TransferrableKeys.transferred]: 0,
      [TransferrableKeys.nodeType]: NodeType.ELEMENT_NODE,
      [TransferrableKeys.localOrNodeName]: 0,
      [TransferrableKeys.textContent]: 1,
      [TransferrableKeys.attributes]: [[2, 3, 4]],
      [TransferrableKeys.childNodes]: [],
    },
    strings,
  };
}
