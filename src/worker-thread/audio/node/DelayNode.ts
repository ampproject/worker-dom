import { AudioNode } from './AudioNode';
import { DelayOptions, IAudioParam, IDelayNode } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { AudioParam } from '../AudioParam';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class DelayNode extends AudioNode implements IDelayNode {
  private _delayTime: IAudioParam;
  private readonly _delayTimeDefaultValue: number;

  // https://developer.mozilla.org/en-US/docs/Web/API/DelayNode
  constructor(context: BaseAudioContext, options: DelayOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'DelayNode', [...arguments]);
    super(id, context, 1, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this._delayTimeDefaultValue = options.delayTime || 0;
  }

  get delayTime(): IAudioParam {
    if (this._delayTime) {
      return this._delayTime;
    }

    this._delayTime = this.createObjectReference('delayTime', [], (id) => new AudioParam(id, this.context, 'a-rate', this._delayTimeDefaultValue));

    return this._delayTime;
  }
}
