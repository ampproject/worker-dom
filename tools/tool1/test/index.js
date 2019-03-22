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

import test from 'ava';
import path from 'path';
import fs from 'fs';
import { transformFileSync } from 'babel-core';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

test.beforeEach(t => {
  const warnings = [];
  console.test = function(warning) {
    warnings.push(warning);
  };

  t.context = {
    warnings,
  };
});

test.afterEach(t => {
  delete console.test;
  t.context.warnings.length = 0;
});

function process(fixture) {
  transformFileSync(path.join(FIXTURES_DIR, fixture, 'input.js'));
}

test.serial('test matching-no-ok', t => {
  process('matching-no-ok');

  const { warnings } = t.context;
  t.is(warnings.length, 11);
  t.true(warnings[0].message.indexOf('Cannot use \'pageXOffset\'') != -1);
  t.true(warnings[1].message.indexOf('pageXOffset') != -1);
  t.true(warnings[2].message.indexOf('pageXOffset') != -1);
  t.true(warnings[3].message.indexOf('pageXOffset') != -1);
  t.true(warnings[4].message.indexOf('pageXOffset') != -1);
  t.true(warnings[5].message.indexOf('offsetWidth') != -1);
  t.true(warnings[6].message.indexOf('getBoundingClientRect') != -1);
  t.true(warnings[7].message.indexOf('getComputedStyle') != -1);
  t.true(warnings[8].message.indexOf('getComputedStyle') != -1);
  t.true(warnings[9].message.indexOf('getComputedStyle') != -1);
  t.true(warnings[10].message.indexOf('pageXOffset') != -1);
});

test.serial('test matching-ok', t => {
  process('matching-ok');

  const { warnings } = t.context;
  console.log(warnings);
  t.is(warnings.length, 0);
});

test.serial('test not-matching', t => {
  process('not-matching');

  const { warnings } = t.context;
  t.is(warnings.length, 0);
});
