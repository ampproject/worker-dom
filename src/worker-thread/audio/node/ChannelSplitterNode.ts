import { AudioNode } from './AudioNode';
import { ChannelSplitterOptions, IChannelSplitterNode } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class ChannelSplitterNode extends AudioNode implements IChannelSplitterNode {
  // https://developer.mozilla.org/en-US/docs/Web/API/ChannelSplitterNode
  constructor(context: BaseAudioContext, options: ChannelSplitterOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'ChannelSplitterNode', arguments);

    super(id, context, 1, options.numberOfOutputs || 6, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'explicit',
      channelInterpretation: options.channelInterpretation || 'discrete',
    });
  }
}
