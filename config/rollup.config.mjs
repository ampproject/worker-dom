import MainThreadBuilds from './rollup.main-thread.mjs';
import WorkerThreadBuilds from './rollup.worker-thread.mjs';

export default [...MainThreadBuilds, ...WorkerThreadBuilds];
