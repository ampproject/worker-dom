import { AudioScheduledSourceNode } from './AudioScheduledSourceNode';
import { IAudioParam, IOscillatorNode, IPeriodicWave, OscillatorOptions, OscillatorType } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { AudioParam } from '../AudioParam';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class OscillatorNode extends AudioScheduledSourceNode implements IOscillatorNode {
  private _detune: IAudioParam;
  private _frequency: IAudioParam;
  private readonly _detuneDefaultValue: number;
  private readonly _frequencyDefaultValue: number;
  private _type: OscillatorType = 'sine';

  // https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
  constructor(context: BaseAudioContext, options: OscillatorOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'OscillatorNode', arguments);

    super(id, context, 0, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this._type = options.type || 'sine';
    this._detuneDefaultValue = options.detune || 1;
    this._frequencyDefaultValue = options.frequency || 440;
  }

  setPeriodicWave(periodicWave: IPeriodicWave): void {
    this[TransferrableKeys.mutated]('setPeriodicWave', arguments);
  }

  get detune(): IAudioParam {
    if (this._detune) {
      return this._detune;
    }

    this._detune = this.createObjectReference('detune', [], (id) => new AudioParam(id, this.context, 'a-rate', this._detuneDefaultValue));
    return this._detune;
  }

  get frequency(): IAudioParam {
    if (this._frequency) {
      return this._frequency;
    }

    this._frequency = this.createObjectReference('frequency', [], (id) => new AudioParam(id, this.context, 'a-rate', this._frequencyDefaultValue));
    return this._frequency;
  }

  get type(): OscillatorType {
    return this._type;
  }

  set type(value: OscillatorType) {
    if (this._type != value) {
      this.setProperty('type', value);
      this._type = value;
    }
  }
}
