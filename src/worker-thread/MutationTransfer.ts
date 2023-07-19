import { consume as consumeNodes } from './nodes';
import { consume as consumeStrings } from './strings';
import { MessageType, MutationFromWorker } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { Node } from './dom/Node';
import { Phase } from '../transfer/Phase';
import { phase, set as setPhase } from './phase';
import { Document } from './dom/Document';
import { DocumentStub } from './dom/DocumentStub';
import { serializeTransferableMessage } from './serializeTransferrableObject';
import { Serializable } from './worker-thread';

let pending = false;
let pendingMutations: Array<ArrayBuffer> = [];

export function transfer(document: Document | DocumentStub, mutation: Array<Serializable>): void {
  if (process.env.SERVER) {
    return;
  }

  if (phase > Phase.Initializing && document[TransferrableKeys.allowTransfer]) {
    pending = true;
    pendingMutations.push(serializeTransferableMessage(mutation).buffer);

    Promise.resolve().then((_) => {
      if (pending) {
        const transferable = [];
        const msg: any = {
          [TransferrableKeys.type]: phase === Phase.Mutating ? MessageType.MUTATE : MessageType.HYDRATE,
        };

        const nodes: Array<Node> = consumeNodes();
        if (nodes.length > 0) {
          const serialized = new Uint16Array(nodes.reduce((acc: Array<number>, node: Node) => acc.concat(node[TransferrableKeys.creationFormat]), []))
            .buffer;

          msg[TransferrableKeys.nodes] = serialized;
          transferable.push(serialized);
        }

        const strings = consumeStrings();
        if (strings.length > 0) {
          msg[TransferrableKeys.strings] = strings;
        }

        if (pendingMutations.length > 0) {
          msg[TransferrableKeys.mutations] = pendingMutations;
          transferable.push(...pendingMutations);
        }

        document.postMessage(msg as MutationFromWorker, transferable);

        pendingMutations = [];
        pending = false;
        setPhase(Phase.Mutating);
      }
    });
  }
}
