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
