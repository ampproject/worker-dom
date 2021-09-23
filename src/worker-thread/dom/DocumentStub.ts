import { PostMessage } from '../worker-thread';
import { Phase } from '../../transfer/Phase';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { set as setPhase } from '../phase';
import { WorkerNoDOMGlobalScope } from '../WorkerDOMGlobalScope';

/**
 * A lightweight Document stub for the no-dom amp binary.
 */
export class DocumentStub {
  // Internal variables.
  public defaultView: WorkerNoDOMGlobalScope;
  public postMessage: PostMessage;
  public addGlobalEventListener: Function;
  public removeGlobalEventListener: Function;
  public [TransferrableKeys.allowTransfer]: boolean = true;
  public [TransferrableKeys.index]: number = -1;

  constructor() {
    this.defaultView = { document: this };
  }

  public [TransferrableKeys.observe](): void {
    setPhase(Phase.Mutating);
  }
}
