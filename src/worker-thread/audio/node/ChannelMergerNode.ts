import { ChannelMergerOptions, IChannelMergerNode } from '../AudioTypes';
import { AudioNode } from './AudioNode';
import { BaseAudioContext } from '../BaseAudioContext';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class ChannelMergerNode extends AudioNode implements IChannelMergerNode {
  // https://developer.mozilla.org/en-US/docs/Web/API/ChannelMergerNode
  constructor(context: BaseAudioContext, options: ChannelMergerOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'ChannelMergerNode', arguments);

    super(id, context, options.numberOfInputs || 6, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'explicit',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });
  }
}
