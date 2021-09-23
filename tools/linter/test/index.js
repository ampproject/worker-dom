import test from 'ava';
import path from 'path';
import { transformFileSync } from '@babel/core';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

test.beforeEach((t) => {
  const warnings = [];
  console.test = function (warning) {
    warnings.push(warning);
  };

  t.context = {
    warnings,
  };
});

test.afterEach((t) => {
  delete console.test;
  t.context.warnings.length = 0;
});

function process(fixture) {
  transformFileSync(path.join(FIXTURES_DIR, fixture + '.js'));
}

test.serial('test matching-no-ok', (t) => {
  process('matching-no-ok');

  const { warnings } = t.context;
  t.is(warnings.length, 15);
  // `pageXOffset;`
  t.true(warnings[0].message.indexOf("Cannot use 'pageXOffset'") != -1);
  // `x = pageXOffset;`
  t.true(warnings[1].message.indexOf('pageXOffset') != -1);
  // `x = pageXOffset + 10;`
  t.true(warnings[2].message.indexOf('pageXOffset') != -1);
  // `x(pageXOffset);`
  t.true(warnings[3].message.indexOf('pageXOffset') != -1);
  // `window.pageXOffset;`
  t.true(warnings[4].message.indexOf('pageXOffset') != -1);
  // `btn.offsetWidth;`
  t.true(warnings[5].message.indexOf('offsetWidth') != -1);
  // `btn['offsetWidth'];`
  t.true(warnings[6].message.indexOf('offsetWidth') != -1);
  // `bth.getBoundingClientRect();`
  t.true(warnings[7].message.indexOf('getBoundingClientRect') != -1);
  // bth['getBoundingClientRect']();
  t.true(warnings[8].message.indexOf('getBoundingClientRect') != -1);
  // `getComputedStyle();`
  t.true(warnings[9].message.indexOf('getComputedStyle') != -1);
  // `getComputedStyle(btn);`
  t.true(warnings[10].message.indexOf('getComputedStyle') != -1);
  // `window.getComputedStyle(btn);`
  t.true(warnings[11].message.indexOf('getComputedStyle') != -1);
  // `if (pageXOffset) {}`
  t.true(warnings[12].message.indexOf('pageXOffset') != -1);
  // ```function one(btn) {
  //   var { offsetWidth } = btn;
  //   offsetWidth;
  // }```
  t.true(warnings[13].message.indexOf('offsetWidth') != -1);
  // ```function two(btn) {
  //   var { 'offsetWidth': x } = btn;
  //   offsetWidth;
  // }```
  t.true(warnings[14].message.indexOf('offsetWidth') != -1);
});

test.serial('test matching-ok', (t) => {
  process('matching-ok');

  const { warnings } = t.context;
  t.is(warnings.length, 0);
});

test.serial('test not-matching', (t) => {
  process('not-matching');

  const { warnings } = t.context;
  t.is(warnings.length, 0);
});
