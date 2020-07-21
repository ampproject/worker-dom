/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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

interface Queued {
  handle: number;
  callback: Function;
  cancelled: boolean;
}

const frameDuration = 1000 / 60;
let last: number = 0;
let id: number = 0;
let queue: Array<Queued> = [];

/**
 * Schedules the accumulated callbacks to be fired 16ms after the last round.
 */
function scheduleNext() {
  const now = Date.now();
  const next = Math.round(Math.max(0, frameDuration - (Date.now() - last)));
  last = now + next;

  setTimeout(function () {
    var cp = queue.slice(0);
    // Clear queue here to prevent
    // callbacks from appending listeners
    // to the current frame's queue
    queue.length = 0;
    for (var i = 0; i < cp.length; i++) {
      if (cp[i].cancelled) {
        continue;
      }
      try {
        cp[i].callback(last);
      } catch (e) {
        setTimeout(function () {
          throw e;
        }, 0);
      }
    }
  }, next);
}

export function rafPolyfill(callback: FrameRequestCallback): number {
  if (queue.length === 0) {
    scheduleNext();
  }
  if (id === Number.MAX_SAFE_INTEGER) {
    id = 0;
  }

  queue.push({
    handle: ++id,
    callback,
    cancelled: false,
  });
  return id;
}

export function cafPolyfill(handle: number): void {
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].handle === handle) {
      queue[i].cancelled = true;
      return;
    }
  }
}
