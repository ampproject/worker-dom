import { AudioNode } from './AudioNode';
import { BiquadFilterOptions, BiquadFilterType, IAudioParam, IBiquadFilterNode } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { AudioParam } from '../AudioParam';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class BiquadFilterNode extends AudioNode implements IBiquadFilterNode {
  private _Q: IAudioParam;
  private _detune: IAudioParam;
  private _frequency: IAudioParam;
  private _gain: IAudioParam;
  private readonly _QDefaultValue: number;
  private readonly _detuneDefaultValue: number;
  private readonly _frequencyDefaultValue: number;
  private readonly _gainDefaultValue: number;
  private _type: BiquadFilterType;

  // https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
  constructor(context: BaseAudioContext, options: BiquadFilterOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'BiquadFilterNode', [...arguments]);

    super(id, context, 1, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this._QDefaultValue = options.Q || 1;
    this._detuneDefaultValue = options.detune || 0;
    this._frequencyDefaultValue = options.frequency || 350;
    this._gainDefaultValue = options.gain || 0;
    this._type = options.type || 'lowpass';
  }

  get Q(): IAudioParam {
    if (this._Q) {
      return this._Q;
    }

    const id = this.createObjectReference('Q', []);
    this._Q = new AudioParam(id, this.context, 'a-rate', this._QDefaultValue);
    return this._Q;
  }

  get detune(): IAudioParam {
    if (this._detune) {
      return this._detune;
    }

    const id = this.createObjectReference('detune', []);
    this._detune = new AudioParam(id, this.context, 'a-rate', this._detuneDefaultValue);
    return this._detune;
  }

  get frequency(): IAudioParam {
    if (this._frequency) {
      return this._frequency;
    }

    const id = this.createObjectReference('frequency', []);
    this._frequency = new AudioParam(id, this.context, 'a-rate', this._frequencyDefaultValue);
    return this._frequency;
  }

  get gain(): IAudioParam {
    if (this._gain) {
      return this._gain;
    }

    const id = this.createObjectReference('gain', []);
    this._gain = new AudioParam(id, this.context, 'a-rate', this._gainDefaultValue);
    return this._gain;
  }

  get type(): BiquadFilterType {
    return this._type;
  }

  set type(value: BiquadFilterType) {
    if (this._type != value) {
      this.setProperty('type', value);
      this._type = value;
    }
  }

  getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void {
    throw new Error('NOT IMPLEMENTED');
  }
}
