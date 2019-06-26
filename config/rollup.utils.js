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

const { DEBUG_BUNDLE = false, MINIFY_BUNDLE = false, COMPRESS_BUNDLE = false } = process.env;

export let DEBUG_BUNDLE_VALUE = DEBUG_BUNDLE === 'true';
export let MINIFY_BUNDLE_VALUE = MINIFY_BUNDLE === 'true';
export let COMPRESS_BUNDLE_VALUE = COMPRESS_BUNDLE === 'true';
