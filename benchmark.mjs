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
// appendChild x 127,340 ops/sec ±9.29% (63 runs sampled)
