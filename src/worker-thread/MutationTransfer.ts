import { consume as consumeNodes } from './nodes.js';
import { consume as consumeStrings } from './strings.js';
import { MessageType, MutationFromWorker } from '../transfer/Messages.js';
import { TransferrableKeys } from '../transfer/TransferrableKeys.js';
import { Node } from './dom/Node.js';
import { Phase } from '../transfer/Phase.js';
import { phase, set as setPhase } from './phase.js';
import { Document } from './dom/Document.js';
import { DocumentStub } from './dom/DocumentStub.js';

let pending = false;
let pendingMutations: Array<number> = [];

// TODO(choumx): Change `mutation` to Array<Uint16> to prevent casting errors e.g. integer underflow, precision loss.
export function transfer(document: Document | DocumentStub, mutation: Array<number>): void {
  if (process.env.SERVER) {
    return;
  }

  if (phase > Phase.Initializing && document[TransferrableKeys.allowTransfer]) {
    pending = true;
    pendingMutations = pendingMutations.concat(mutation);

    Promise.resolve().then((_) => {
      if (pending) {
        const nodes = new Uint16Array(
          consumeNodes().reduce((acc: Array<number>, node: Node) => acc.concat(node[TransferrableKeys.creationFormat]), []),
        ).buffer;
        const mutations = new Uint16Array(pendingMutations).buffer;

        document.postMessage(
          {
            [TransferrableKeys.phase]: phase,
            [TransferrableKeys.type]: phase === Phase.Mutating ? MessageType.MUTATE : MessageType.HYDRATE,
            [TransferrableKeys.nodes]: nodes,
            [TransferrableKeys.strings]: consumeStrings(),
            [TransferrableKeys.mutations]: mutations,
          } as MutationFromWorker,
          [nodes, mutations],
        );

        pendingMutations = [];
        pending = false;
        setPhase(Phase.Mutating);
      }
    });
  }
}
