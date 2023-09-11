import { AudioNode } from './AudioNode';
import { DistanceModelType, IAudioParam, IPannerNode, PannerOptions, PanningModelType } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { AudioParam } from '../AudioParam';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class PannerNode extends AudioNode implements IPannerNode {
  private _coneInnerAngle: number = 360;
  private _coneOuterAngle: number = 0;
  private _coneOuterGain: number = 0;
  private _distanceModel: DistanceModelType = 'inverse';
  private _maxDistance: number = 10000;
  private _orientationX: IAudioParam;
  private _orientationY: IAudioParam;
  private _orientationZ: IAudioParam;
  private _panningModel: PanningModelType = 'equalpower';
  private _positionX: IAudioParam;
  private _positionY: IAudioParam;
  private _positionZ: IAudioParam;
  private _refDistance: number = 1;
  private _rolloffFactor: number = 1;

  private readonly _orientationXDefaultValue: number;
  private readonly _orientationYDefaultValue: number;
  private readonly _orientationZDefaultValue: number;
  private readonly _positionXDefaultValue: number;
  private readonly _positionYDefaultValue: number;
  private readonly _positionZDefaultValue: number;

  // https://developer.mozilla.org/en-US/docs/Web/API/PannerNode
  constructor(context: BaseAudioContext, options: PannerOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'PannerNode', arguments);

    super(id, context, 1, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'clamped-max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this._coneInnerAngle = options.coneInnerAngle || 360;
    this._coneOuterAngle = options.coneOuterAngle || 0;
    this._coneOuterGain = options.coneOuterGain || 0;
    this._distanceModel = options.distanceModel || 'inverse';
    this._maxDistance = options.maxDistance || 10000;
    this._panningModel = options.panningModel || 'equalpower';
    this._refDistance = options.refDistance || 1;
    this._rolloffFactor = options.rolloffFactor || 1;

    this._orientationXDefaultValue = options.orientationX || 1;
    this._orientationYDefaultValue = options.orientationY || 0;
    this._orientationZDefaultValue = options.orientationZ || 0;
    this._positionXDefaultValue = options.positionX || 0;
    this._positionYDefaultValue = options.positionY || 0;
    this._positionZDefaultValue = options.positionZ || 0;
  }

  setOrientation(x: number, y: number, z: number): void {
    this[TransferrableKeys.mutated]('setOrientation', arguments);
  }

  setPosition(x: number, y: number, z: number): void {
    this[TransferrableKeys.mutated]('setPosition', arguments);
  }

  get orientationX(): IAudioParam {
    if (this._orientationX) {
      return this._orientationX;
    }

    this._orientationX = this.createObjectReference(
      'orientationX',
      [],
      (id) => new AudioParam(id, this.context, 'a-rate', this._orientationXDefaultValue),
    );
    return this._orientationX;
  }

  get orientationY(): IAudioParam {
    if (this._orientationY) {
      return this._orientationY;
    }

    this._orientationY = this.createObjectReference(
      'orientationY',
      [],
      (id) => new AudioParam(id, this.context, 'a-rate', this._orientationYDefaultValue),
    );
    return this._orientationY;
  }

  get orientationZ(): IAudioParam {
    if (this._orientationZ) {
      return this._orientationZ;
    }

    this._orientationZ = this.createObjectReference(
      'orientationZ',
      [],
      (id) => new AudioParam(id, this.context, 'a-rate', this._orientationZDefaultValue),
    );
    return this._orientationZ;
  }

  get positionX(): IAudioParam {
    if (this._positionX) {
      return this._positionX;
    }

    this._positionX = this.createObjectReference('positionX', [], (id) => new AudioParam(id, this.context, 'a-rate', this._positionXDefaultValue));
    return this._positionX;
  }

  get positionY(): IAudioParam {
    if (this._positionY) {
      return this._positionY;
    }

    this._positionY = this.createObjectReference('positionY', [], (id) => new AudioParam(id, this.context, 'a-rate', this._positionYDefaultValue));
    return this._positionY;
  }

  get positionZ(): IAudioParam {
    if (this._positionZ) {
      return this._positionZ;
    }

    this._positionZ = this.createObjectReference('positionZ', [], (id) => new AudioParam(id, this.context, 'a-rate', this._positionZDefaultValue));
    return this._positionZ;
  }

  get coneInnerAngle(): number {
    return this._coneInnerAngle;
  }

  set coneInnerAngle(value: number) {
    if (this._coneInnerAngle != value) {
      this.setProperty('coneInnerAngle', value);
      this._coneInnerAngle = value;
    }
  }

  get coneOuterAngle(): number {
    return this._coneOuterAngle;
  }

  set coneOuterAngle(value: number) {
    if (this._coneOuterAngle != value) {
      this.setProperty('coneOuterAngle', value);
      this._coneOuterAngle = value;
    }
  }

  get coneOuterGain(): number {
    return this._coneOuterGain;
  }

  set coneOuterGain(value: number) {
    if (this._coneOuterGain != value) {
      this.setProperty('coneOuterGain', value);
      this._coneOuterGain = value;
    }
  }

  get distanceModel(): DistanceModelType {
    return this._distanceModel;
  }

  set distanceModel(value: DistanceModelType) {
    if (this._distanceModel != value) {
      this.setProperty('distanceModel', value);
      this._distanceModel = value;
    }
  }

  get maxDistance(): number {
    return this._maxDistance;
  }

  set maxDistance(value: number) {
    if (this._maxDistance != value) {
      this.setProperty('maxDistance', value);
      this._maxDistance = value;
    }
  }

  get panningModel(): PanningModelType {
    return this._panningModel;
  }

  set panningModel(value: PanningModelType) {
    this._panningModel = value;
    if (this._panningModel != value) {
      this.setProperty('panningModel', value);
      this._panningModel = value;
    }
  }

  get refDistance(): number {
    return this._refDistance;
  }

  set refDistance(value: number) {
    this._refDistance = value;
    if (this._refDistance != value) {
      this.setProperty('refDistance', value);
      this._refDistance = value;
    }
  }

  get rolloffFactor(): number {
    return this._rolloffFactor;
  }

  set rolloffFactor(value: number) {
    this._rolloffFactor = value;
    if (this._rolloffFactor != value) {
      this.setProperty('rolloffFactor', value);
      this._rolloffFactor = value;
    }
  }
}
