import { WorkerContext } from "../worker";
import { TransferrableKeys } from "../../transfer/TransferrableKeys";
import { MessageType } from "../../transfer/Messages";
import { NodeContext } from "../nodes";
import { TransferrableMutationRecord } from "../../transfer/TransferrableRecord";
import { NumericBoolean } from "../../utils";

declare var OffscreenCanvas: any;

export class OffscreenCanvasProcessor {
    private nodeContext: NodeContext;
    private workerContext: WorkerContext;

    constructor(nodeContext: NodeContext, workerContext: WorkerContext) {
        this.nodeContext = nodeContext;
        this.workerContext = workerContext;
    }

    process(mutation: TransferrableMutationRecord): void {
        const nodeId = mutation[TransferrableKeys.target];
        const target = this.nodeContext.getNode(nodeId);

        if (!target) {
            console.error('getNode() yields a null value. Node id (' + nodeId + ') was not found.');
            return;
        }

        // Probably should find a way to pass in w and h
        const offscreenCanvasInstance = new OffscreenCanvas(100, 100);

        this.workerContext.messageToWorker({
            [TransferrableKeys.type]: MessageType.OFFSCREEN_CANVAS_INSTANCE,
            [TransferrableKeys.target]: {
                // This is a TransferredNode (index: number, transferred: NumericBoolean)
                [TransferrableKeys.index]: target._index_,
                [TransferrableKeys.transferred]: NumericBoolean.TRUE,
            }, // TransferredNode - canvas element????
            [TransferrableKeys.data]: offscreenCanvasInstance, // Object, an OffscreenCanvas
        });
    }
}