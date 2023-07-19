import { NodeContext } from './nodes';
import { StringContext } from './strings';
import { WorkerContext } from './worker';
import { OffscreenCanvasProcessor } from './commands/offscreen-canvas';
import { isUserVisibleMutation, ReadableMutationType, TransferrableMutationType } from '../transfer/TransferrableMutation';
import { EventSubscriptionProcessor } from './commands/event-subscription';
import { BoundingClientRectProcessor } from './commands/bounding-client-rect';
import { ChildListProcessor } from './commands/child-list';
import { AttributeProcessor } from './commands/attribute';
import { CharacterDataProcessor } from './commands/character-data';
import { PropertyProcessor } from './commands/property';
import { LongTaskExecutor } from './commands/long-task';
import { CommandExecutor } from './commands/interface';
import { MutationPumpFunction, WorkerDOMConfiguration } from './configuration';
import { Phase } from '../transfer/Phase';
import { ObjectMutationProcessor } from './commands/object-mutation';
import { ObjectCreationProcessor } from './commands/object-creation';
import { ObjectContext } from './object-context';
import { ImageBitmapProcessor } from './commands/image-bitmap';
import { StorageProcessor } from './commands/storage';
import { FunctionProcessor } from './commands/function';
import { ScrollIntoViewProcessor } from './commands/scroll-into-view';
import { CallFunctionProcessor } from './commands/call-function';
import { BytesStream } from '../transfer/BytesStream';
import { deserializeTransferableMessage } from './deserializeTransferrableObject';
import { ObjectDeletionProcessor } from './commands/object-deletion';

export class MutatorProcessor {
  private stringContext: StringContext;
  private nodeContext: NodeContext;
  private objectContext: ObjectContext;
  private mutationQueue: Array<ArrayBuffer> = [];
  private pendingMutations: boolean = false;
  private mutationPumpFunction: MutationPumpFunction;
  private sanitizer: Sanitizer | undefined;
  private executors: {
    [key: number]: CommandExecutor;
  };

  /**
   * @param stringContext
   * @param nodeContext
   * @param workerContext
   * @param sanitizer Sanitizer to apply to content if needed.
   */
  constructor(
    stringContext: StringContext,
    nodeContext: NodeContext,
    workerContext: WorkerContext,
    config: WorkerDOMConfiguration,
    objectContext: ObjectContext,
  ) {
    this.stringContext = stringContext;
    this.nodeContext = nodeContext;
    this.objectContext = objectContext;
    this.sanitizer = config.sanitizer;
    this.mutationPumpFunction = config.mutationPump;

    const args: [StringContext, NodeContext, WorkerContext, ObjectContext, WorkerDOMConfiguration] = [
      stringContext,
      nodeContext,
      workerContext,
      objectContext,
      config,
    ];
    const sharedLongTaskProcessor = LongTaskExecutor.apply(null, args);
    this.executors = {
      [TransferrableMutationType.CHILD_LIST]: ChildListProcessor.apply(null, args),
      [TransferrableMutationType.ATTRIBUTES]: AttributeProcessor.apply(null, args),
      [TransferrableMutationType.CHARACTER_DATA]: CharacterDataProcessor.apply(null, args),
      [TransferrableMutationType.PROPERTIES]: PropertyProcessor.apply(null, args),
      [TransferrableMutationType.EVENT_SUBSCRIPTION]: EventSubscriptionProcessor.apply(null, args),
      [TransferrableMutationType.GET_BOUNDING_CLIENT_RECT]: BoundingClientRectProcessor.apply(null, args),
      [TransferrableMutationType.LONG_TASK_START]: sharedLongTaskProcessor,
      [TransferrableMutationType.LONG_TASK_END]: sharedLongTaskProcessor,
      [TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE]: OffscreenCanvasProcessor.apply(null, args),
      [TransferrableMutationType.OBJECT_MUTATION]: ObjectMutationProcessor.apply(null, args),
      [TransferrableMutationType.OBJECT_CREATION]: ObjectCreationProcessor.apply(null, args),
      [TransferrableMutationType.IMAGE_BITMAP_INSTANCE]: ImageBitmapProcessor.apply(null, args),
      [TransferrableMutationType.STORAGE]: StorageProcessor.apply(null, args),
      [TransferrableMutationType.FUNCTION_CALL]: FunctionProcessor.apply(null, args),
      [TransferrableMutationType.SCROLL_INTO_VIEW]: ScrollIntoViewProcessor.apply(null, args),
      [TransferrableMutationType.CALL_FUNCTION]: CallFunctionProcessor.apply(null, args),
      [TransferrableMutationType.OBJECT_DELETION]: ObjectDeletionProcessor.apply(null, args),
    };
  }

  /**
   * Process MutationRecords from worker thread applying changes to the existing DOM.
   * @param phase Current Phase Worker Thread exists in.
   * @param nodes New nodes to add in the main thread with the incoming mutations.
   * @param stringValues Additional string values to use in decoding messages.
   * @param mutations Changes to apply in both graph shape and content of Elements.
   */
  public mutate(phase: Phase, nodes: ArrayBuffer, stringValues: Array<string>, mutations: Array<ArrayBuffer>): void {
    this.stringContext.storeValues(stringValues);
    this.nodeContext.createNodes(nodes, this.sanitizer);
    this.mutationQueue.push(...mutations);
    if (!this.pendingMutations) {
      this.pendingMutations = true;
      this.mutationPumpFunction(this.syncFlush, phase);
    }
  }

  /**
   * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
   * mutations to apply in a single frame.
   *
   * Investigations in using asyncFlush to resolve are worth considering.
   *
   * @param allowVisibleMutations
   * @return Array of mutation types that were disallowed.
   */
  private syncFlush = (allowVisibleMutations: boolean = true): TransferrableMutationType[] => {
    if (WORKER_DOM_DEBUG) {
      console.group('Mutations');
    }
    const disallowedMutations: TransferrableMutationType[] = [];
    this.mutationQueue
      .map((mutationArrayBuffer) => new BytesStream(mutationArrayBuffer))
      .forEach((bytesStream) => {
        const parameters = deserializeTransferableMessage(bytesStream, this.stringContext, this.nodeContext, this.objectContext);

        const mutationType = parameters[0]; // TransferrableMutationType is always at position 0.

        // TODO(worker-dom): Hoist `allow` up to entry point (index.amp.ts) to avoid bundling `isUserVisibleMutation`.
        const allow = allowVisibleMutations || !isUserVisibleMutation(mutationType);
        if (!allow) {
          // TODO(worker-dom): Consider returning the strings from executor.print() for better error messaging.
          disallowedMutations.push(mutationType);
        }
        const executor = this.executors[mutationType];
        if (WORKER_DOM_DEBUG) {
          console.log(allow ? '' : '[disallowed]', ReadableMutationType[mutationType], executor.print(parameters));
        }

        executor.execute(parameters, allow);
      });
    if (WORKER_DOM_DEBUG) {
      console.groupEnd();
    }
    this.mutationQueue = [];
    this.pendingMutations = false;
    return disallowedMutations;
  };
}
