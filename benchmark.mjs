import Benchmark from 'benchmark';

import { createDocument } from './dist/server-lib.mjs';
const doc = createDocument();

var suite = new Benchmark.Suite();
suite
  .add('createElement', function () {
    doc.createElement('test-elem');
  })
  .on('complete', function () {
    const results = Array.from(this);
    console.log(results.join('\n'));
  })
  .run();
