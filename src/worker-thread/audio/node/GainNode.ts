import { AudioNode } from './AudioNode';
import { GainOptions, IAudioParam, IGainNode } from '../AudioTypes';
import { AudioParam } from '../AudioParam';
import { BaseAudioContext } from '../BaseAudioContext';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class GainNode extends AudioNode implements IGainNode {
  private _gain: IAudioParam;
  private readonly _gainDefaultValue: number;

  // https://developer.mozilla.org/en-US/docs/Web/API/GainNode
  constructor(context: BaseAudioContext, options: GainOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'GainNode', arguments);

    super(id, context, 1, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this._gainDefaultValue = options.gain || 1;
  }

  get gain(): IAudioParam {
    if (this._gain) {
      return this._gain;
    }

    this._gain = this.createObjectReference('gain', [], (id) => new AudioParam(id, this.context, 'a-rate', this._gainDefaultValue));
    return this._gain;
  }
}
