/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
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

import polka from 'polka';
import serveStatic from 'serve-static';
import path from 'path';

const { PORT = 3001, PWD } = process.env;

polka()
  .use(serveStatic(path.resolve(PWD)))
  .use(serveStatic(path.resolve(PWD, 'demo')))
  .get('/health', (req, res) => {
    res.end('OK');
  })
  .listen(PORT)
  .then(_ => {
    console.log(`> Running on http://localhost:${PORT}`);
  });
