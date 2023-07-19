import { AudioNode } from './AudioNode';
import { IAudioDestinationNode } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';

export class AudioDestinationNode extends AudioNode implements IAudioDestinationNode {
  readonly maxChannelCount: number = 2;

  // https://developer.mozilla.org/en-US/docs/Web/API/AudioDestinationNode
  constructor(id: number, context: BaseAudioContext) {
    super(id, context, 1, 0, {
      channelCount: 2,
      channelCountMode: 'explicit',
      channelInterpretation: 'speakers',
    });
  }
}
