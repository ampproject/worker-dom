import { AudioNode } from './AudioNode';
import { IIIRFilterNode, IIRFilterOptions } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class IIRFilterNode extends AudioNode implements IIIRFilterNode {
  // https://developer.mozilla.org/en-US/docs/Web/API/IIRFilterNode
  constructor(context: BaseAudioContext, options: IIRFilterOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'IIRFilterNode', arguments);
    super(id, context, 1, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });
  }

  getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void {
    throw new Error('NOT IMPLEMENTED');
  }
}
