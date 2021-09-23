import Benchmark from 'benchmark';

import { createDocument } from './dist/server-lib.mjs';
const doc = createDocument();

var suite = new Benchmark.Suite();
suite
  .add('createElement', function () {
    doc.createElement('test-elem');
  })
  .add('appendChild', function () {
    doc.appendChild(doc.createElement('div'));
  })
  .on('complete', function () {
    const results = Array.from(this);
    console.log(results.join('\n'));
  })
  .run();

// Before any optimization:
// createElement x 197,202 ops/sec ±5.21% (72 runs sampled)

// When skipping `store`
// createElement x 449,453 ops/sec ±2.38% (83 runs sampled)

// When skipping CSSStyleDeclaration init
// createElement x 626,866 ops/sec ±2.26% (85 runs sampled)

// When adding in assumption re. class fields
// createElement x 643,255 ops/sec ±2.16% (86 runs sampled)
