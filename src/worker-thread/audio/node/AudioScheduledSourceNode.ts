import { AudioNode } from './AudioNode';
import { AudioNodeOptions, IAudioScheduledSourceNode } from '../AudioTypes';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';
import { BaseAudioContext } from '../BaseAudioContext';

export abstract class AudioScheduledSourceNode extends AudioNode implements IAudioScheduledSourceNode {
  constructor(id: number, context: BaseAudioContext, numberOfInputs: number, numberOfOutputs: number, options: AudioNodeOptions, keys?: string[]) {
    keys = keys || [];
    keys.push('onended');
    super(id, context, numberOfInputs, numberOfOutputs, options, keys);
  }

  start(when?: number): void {
    this[TransferrableKeys.mutated]('start', arguments);
  }

  stop(when?: number): void {
    this[TransferrableKeys.mutated]('stop', arguments);
  }
}
