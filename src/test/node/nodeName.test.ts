import test from 'ava';
import { createTestingDocument } from '../DocumentCreation';

test('returns the name of the Node', (t) => {
  const document = createTestingDocument();
  const node = document.createTextNode('');
  const nodeTwo = document.createElement('div');

  t.is(document.nodeName, '#document', 'document node returns a valid document node name');
  t.is(node.nodeName, '#text', 'text node returns a valid text node name');
  t.is(nodeTwo.nodeName, 'DIV', 'standard element node returns a valid node name');
});
