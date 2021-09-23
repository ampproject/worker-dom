import { WorkerDOMConfiguration } from '../configuration';
import { StringContext } from '../strings';
import { NodeContext } from '../nodes';
import { WorkerContext } from '../worker';
import { ObjectContext } from '../object-context';

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
