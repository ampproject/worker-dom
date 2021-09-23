import test from 'ava';
import { createTestingDocument } from '../DocumentCreation';
import { SVG_NAMESPACE } from '../../transfer/TransferrableNodes';

test('svg should have the SVG namespaceURI', (t) => {
  const document = createTestingDocument();
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');

  t.is(svg.namespaceURI, SVG_NAMESPACE);
});
