import { WorkerDOMConfiguration } from '../configuration.js';
import { StringContext } from '../strings.js';
import { NodeContext } from '../nodes.js';
import { WorkerContext } from '../worker.js';
import { ObjectContext } from '../object-context.js';

export interface CommandExecutor {
  /**
   * If `allow` is true, executes `mutations[startPosition]`. Otherwise, noop.
   * @param mutations
   * @param startPosition
   * @param allow
   * @return The index (startPosition) of the next mutation.
   */
  execute(mutations: Uint16Array, startPosition: number, allow: boolean): number;

  print(mutations: Uint16Array, startPosition: number): {};
}

export interface CommandExecutorInterface {
  (
    stringContext: StringContext,
    nodeContext: NodeContext,
    workerContext: WorkerContext,
    objectContext: ObjectContext,
    config: WorkerDOMConfiguration,
  ): CommandExecutor;
}
