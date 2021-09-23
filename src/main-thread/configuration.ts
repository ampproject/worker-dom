import { MessageFromWorker, MessageToWorker } from '../transfer/Messages';
import { Phase } from '../transfer/Phase';
import { HydrateableNode } from '../transfer/TransferrableNodes';
import { DefaultAllowedMutations } from '../transfer/TransferrableMutation';

/**
 * The callback for `mutationPump`. If specified, this callback will be called
 * for the new set of mutations pending. The callback can either immediately
 * call `flush()`, or it can reject mutations, or it can batch them further.
 */
export type MutationPumpFunction = (flush: Function, phase: Phase) => void;

export type LongTaskFunction = (promise: Promise<any>) => void;

export type HydrationFilterPredicate = (node: RenderableElement) => boolean;

export interface InboundWorkerDOMConfiguration {
  // ---- Required Values.
  authorURL: string;
  domURL: string;

  // ---- Optional Overrides
  // Schedules mutation phase.
  mutationPump?: MutationPumpFunction;
  // Schedules long task.
  longTask?: LongTaskFunction;
  // Sanitizer for DOM Mutations
  sanitizer?: Sanitizer;
  // Hydration Filter Predicate
  hydrateFilter?: HydrationFilterPredicate;
  // Executor Filter, allow list
  executorsAllowed?: Array<number>;
  // Extra layer of sandboxing by placing Worker inside of iframe.
  sandbox?: { iframeUrl: string };

  // ---- Optional Callbacks
  // Called when worker consumes the page's initial DOM state.
  onCreateWorker?: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => void;
  // Called before a message is sent to the worker.
  onSendMessage?: (message: MessageToWorker) => void;
  // Called after a message is received from the worker.
  onReceiveMessage?: (message: MessageFromWorker) => void;
}

export interface WorkerDOMConfiguration {
  // ---- Required Values.
  authorURL: string;
  domURL: string;

  // ---- Optional, with defaults
  // Schedules mutation phase.
  mutationPump: MutationPumpFunction;
  // Executor Filter, allow list
  executorsAllowed: Array<number>;

  // ---- Optional Overrides
  // Schedules long task.
  longTask?: LongTaskFunction;
  // Sanitizer for DOM Mutations
  sanitizer?: Sanitizer;
  // Hydration Filter Predicate
  hydrateFilter?: HydrationFilterPredicate;
  // Extra layer of sandboxing by placing Worker inside of iframe.
  sandbox?: { iframeUrl: string };

  // ---- Optional Callbacks
  // Called when worker consumes the page's initial DOM state.
  onCreateWorker?: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => void;
  // Called before a message is sent to the worker.
  onSendMessage?: (message: MessageToWorker) => void;
  // Called after a message is received from the worker.
  onReceiveMessage?: (message: MessageFromWorker) => void;
}

export function normalizeConfiguration(config: InboundWorkerDOMConfiguration): WorkerDOMConfiguration {
  return Object.assign(
    {},
    {
      mutationPump: requestAnimationFrame.bind(null),
      executorsAllowed: DefaultAllowedMutations,
    },
    config,
  );
}
