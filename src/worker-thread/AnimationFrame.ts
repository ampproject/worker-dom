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

export const { rafPolyfill, cafPolyfill }: { rafPolyfill: typeof requestAnimationFrame; cafPolyfill: typeof cancelAnimationFrame } = (() => {
  const frameDuration = 1000 / 60;
  let last: number = 0;
  let id: number = 0;
  let queue: Array<Queued> = [];

  function scheduleNext() {
    var _now = performance.now(),
      next = Math.max(0, frameDuration - (_now - last));
    last = next + _now;
    setTimeout(function () {
      var cp = queue.slice(0);
      // Clear queue here to prevent
      // callbacks from appending listeners
      // to the current frame's queue
      queue.length = 0;
      for (var i = 0; i < cp.length; i++) {
        if (!cp[i].cancelled) {
          try {
            cp[i].callback(last);
          } catch (e) {
            setTimeout(function () {
              throw e;
            }, 0);
          }
        }
      }
    }, Math.round(next));
  }

  const rafPolyfill = (callback: FrameRequestCallback) => {
    if (queue.length === 0) {
      scheduleNext();
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false,
    });
    return id;
  };
  function cafPolyfill(handle: number): void {
    for (var i = 0; i < queue.length; i++) {
      if (queue[i].handle === handle) {
        queue[i].cancelled = true;
      }
    }
  }

  return { rafPolyfill, cafPolyfill };
})();
