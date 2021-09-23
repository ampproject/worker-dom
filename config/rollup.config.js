import MainThreadBuilds from './rollup.main-thread.js';
import WorkerThreadBuilds from './rollup.worker-thread.js';

export default [...MainThreadBuilds, ...WorkerThreadBuilds];
