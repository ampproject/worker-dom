import { WorkerContext } from "../worker";
import { TransferrableKeys } from "../../transfer/TransferrableKeys";
import { MessageType } from "../../transfer/Messages";
import { NodeContext } from "../nodes";
import { TransferrableMutationRecord } from "../../transfer/TransferrableRecord";
import { NumericBoolean } from "../../utils";

export class OffscreenCanvasProcessor {
    private nodeContext: NodeContext;
    private workerContext: WorkerContext;

    constructor(nodeContext: NodeContext, workerContext: WorkerContext) {
        this.nodeContext = nodeContext;
        this.workerContext = workerContext;
    }

    process(mutation: TransferrableMutationRecord): void {
        const nodeId = mutation[TransferrableKeys.target];
        const target = this.nodeContext.getNode(nodeId) as HTMLCanvasElement;

        if (!target) {
            console.error('getNode() yields a null value. Node id (' + nodeId + ') was not found.');
            return;
        }
        
        const offscreen = target.transferControlToOffscreen();

        this.workerContext.messageToWorker({
            [TransferrableKeys.type]: MessageType.OFFSCREEN_CANVAS_INSTANCE,
            [TransferrableKeys.target]: {
                // This is a TransferredNode (index: number, transferred: NumericBoolean)
                [TransferrableKeys.index]: target._index_,
                [TransferrableKeys.transferred]: NumericBoolean.TRUE,
            }, 
            [TransferrableKeys.data]: offscreen, // Object, an OffscreenCanvas
        }, [offscreen]);
    }
}