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
import sirv from 'sirv';
import path from 'path';
import fs from 'fs';

const { PORT = 3001 } = process.env;

polka()
  .use(
    sirv(path.resolve(__dirname, '..'), {
      dev: true,
      setHeaders: res => res.setHeader('AMP-Access-Control-Allow-Source-Origin', `http://localhost:${PORT}`),
    }),
  )
  .use(
    sirv(path.resolve(__dirname), {
      dev: true,
      setHeaders: res => res.setHeader('AMP-Access-Control-Allow-Source-Origin', `http://localhost:${PORT}`),
    }),
  )
  .get('/health', (req, res) => {
    res.end('OK');
  })
  .get('/slow/*', (req, res) => {
    const reqPath = req.path.substring('/slow/'.length);
    const file = fs.readFileSync(path.resolve(__dirname, reqPath));
    setTimeout(() => res.end(file), 6000);
  })
  .listen(PORT, _ => {
    console.log(`> Running on http://localhost:${PORT}`);
  });
