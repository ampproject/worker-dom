import { AudioNode } from './AudioNode';
import { IAudioScheduledSourceNode } from '../AudioTypes';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';

export abstract class AudioScheduledSourceNode extends AudioNode implements IAudioScheduledSourceNode {
  // TODO: implement
  onended: ((this: IAudioScheduledSourceNode, ev: Event) => any) | null;

  start(when?: number): void {
    this[TransferrableKeys.mutated]('start', [...arguments]);
  }

  stop(when?: number): void {
    this[TransferrableKeys.mutated]('stop', [...arguments]);
  }
}
