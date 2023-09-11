import { AudioNode } from './AudioNode';
import { IWaveShaperNode, OverSampleType, WaveShaperOptions } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class WaveShaperNode extends AudioNode implements IWaveShaperNode {
  private _curve: Float32Array | null;
  private _oversample: OverSampleType;

  // https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
  constructor(context: BaseAudioContext, options: WaveShaperOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'WaveShaperNode', arguments);

    super(id, context, 1, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    const curve = options.curve;
    if (curve) {
      if (curve instanceof Float32Array) {
        this._curve = curve;
      } else {
        this._curve = new Float32Array(curve);
      }
    } else {
      this._curve = null;
    }

    this._oversample = options.oversample || 'none';
  }

  get curve(): Float32Array | null {
    return this._curve;
  }

  set curve(value: Float32Array | null) {
    if (this._curve != value) {
      this.setProperty('curve', value);
      this._curve = value;
    }
  }

  get oversample(): OverSampleType {
    return this._oversample;
  }

  set oversample(value: OverSampleType) {
    if (this._oversample != value) {
      this.setProperty('oversample', value);
      this._oversample = value;
    }
  }
}
