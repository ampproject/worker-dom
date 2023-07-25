import { AudioNode } from './AudioNode';
import { DynamicsCompressorOptions, IAudioParam, IDynamicsCompressorNode } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { AudioParam } from '../AudioParam';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class DynamicsCompressorNode extends AudioNode implements IDynamicsCompressorNode {
  private _attack: IAudioParam;
  private _knee: IAudioParam;
  private _ratio: IAudioParam;
  // private _reduction: number;
  private _release: IAudioParam;
  private _threshold: IAudioParam;

  private readonly _attackDefaultValue: number;
  private readonly _kneeDefaultValue: number;
  private readonly _ratioDefaultValue: number;
  private readonly _releaseDefaultValue: number;
  private readonly _thresholdDefaultValue: number;

  // https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode
  constructor(context: BaseAudioContext, options: DynamicsCompressorOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'DynamicsCompressorNode', [...arguments]);

    super(id, context, 1, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'clamped-max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this._attackDefaultValue = options.attack || 0.003;
    this._kneeDefaultValue = options.knee || 30;
    this._ratioDefaultValue = options.ratio || 12;
    this._releaseDefaultValue = options.release || 0.25;
    this._thresholdDefaultValue = options.threshold || -24;
  }

  get attack(): IAudioParam {
    if (this._attack) {
      return this._attack;
    }

    this._attack = this.createObjectReference('attack', [], (id) => new AudioParam(id, this.context, 'k-rate', this._attackDefaultValue));
    return this._attack;
  }

  get knee(): IAudioParam {
    if (this._knee) {
      return this._knee;
    }

    this._knee = this.createObjectReference('knee', [], (id) => new AudioParam(id, this.context, 'k-rate', this._kneeDefaultValue));
    return this._knee;
  }

  get ratio(): IAudioParam {
    if (this._ratio) {
      return this._ratio;
    }

    this._ratio = this.createObjectReference('ratio', [], (id) => new AudioParam(id, this.context, 'k-rate', this._ratioDefaultValue));
    return this._ratio;
  }

  get reduction(): number {
    throw new Error('NOT IMPLEMENTED');
  }

  get release(): IAudioParam {
    if (this._release) {
      return this._release;
    }

    this._release = this.createObjectReference('release', [], (id) => new AudioParam(id, this.context, 'k-rate', this._releaseDefaultValue));
    return this._release;
  }

  get threshold(): IAudioParam {
    if (this._threshold) {
      return this._threshold;
    }

    this._threshold = this.createObjectReference('threshold', [], (id) => new AudioParam(id, this.context, 'k-rate', this._thresholdDefaultValue));
    return this._threshold;
  }
}
