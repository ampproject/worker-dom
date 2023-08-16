import MainThreadBuilds from './rollup.main-thread.js';
import WorkerThreadBuilds from './rollup.worker-thread.js';
import LibBuilds from './rollup.lib.js';

export default [...MainThreadBuilds, ...WorkerThreadBuilds, ...LibBuilds];
