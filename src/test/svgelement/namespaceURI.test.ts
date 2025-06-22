import test from 'ava';
import { createTestingDocument } from '../DocumentCreation.js';
import { SVG_NAMESPACE } from '../../transfer/TransferrableNodes.js';

test('svg should have the SVG namespaceURI', (t) => {
  const document = createTestingDocument();
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');

  t.is(svg.namespaceURI, SVG_NAMESPACE);
});
