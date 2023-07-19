import { AudioNode } from './AudioNode';
import { IAudioParam, IStereoPannerNode, StereoPannerOptions } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { AudioParam } from '../AudioParam';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class StereoPannerNode extends AudioNode implements IStereoPannerNode {
  private _pan: IAudioParam;
  private readonly _panDefaultValue: number;

  // https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode
  constructor(context: BaseAudioContext, options: StereoPannerOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'StereoPannerNode', [...arguments]);

    super(id, context, 1, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'clamped-max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this._panDefaultValue = options.pan || 0;
  }

  get pan(): IAudioParam {
    if (this._pan) {
      return this._pan;
    }

    const id = this.createObjectReference('pan', []);
    this._pan = new AudioParam(id, this.context, 'a-rate', this._panDefaultValue);

    return this._pan;
  }
}
