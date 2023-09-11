import { TransferrableAudio } from './TransferrableAudio';
import { IAudioListener, IAudioParam } from './AudioTypes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { AudioParam } from './AudioParam';
import { BaseAudioContext } from './BaseAudioContext';

export class AudioListener extends TransferrableAudio implements IAudioListener {
  private readonly context: BaseAudioContext;

  private _forwardX: IAudioParam;
  private _forwardY: IAudioParam;
  private _forwardZ: IAudioParam;
  private _positionX: IAudioParam;
  private _positionY: IAudioParam;
  private _positionZ: IAudioParam;
  private _upX: IAudioParam;
  private _upY: IAudioParam;
  private _upZ: IAudioParam;

  constructor(id: number, context: BaseAudioContext) {
    super(id, context.document);
    this.context = context;
  }

  get forwardX(): IAudioParam {
    if (this._forwardX) {
      return this._forwardX;
    }

    this._forwardX = this.createObjectReference('forwardX', [], (id) => new AudioParam(id, this.context, 'k-rate', 0));
    return this._forwardX;
  }

  get forwardY(): IAudioParam {
    if (this._forwardY) {
      return this._forwardY;
    }

    this._forwardY = this.createObjectReference('forwardY', [], (id) => new AudioParam(id, this.context, 'k-rate', 0));
    return this._forwardY;
  }

  get forwardZ(): IAudioParam {
    if (this._forwardZ) {
      return this._forwardZ;
    }

    this._forwardZ = this.createObjectReference('forwardZ', [], (id) => new AudioParam(id, this.context, 'k-rate', -1));
    return this._forwardZ;
  }

  get positionX(): IAudioParam {
    if (this._positionX) {
      return this._positionX;
    }

    this._positionX = this.createObjectReference('positionX', [], (id) => new AudioParam(id, this.context, 'k-rate', 0));
    return this._positionX;
  }

  get positionY(): IAudioParam {
    if (this._positionY) {
      return this._positionY;
    }

    this._positionY = this.createObjectReference('positionY', [], (id) => new AudioParam(id, this.context, 'k-rate', 0));
    return this._positionY;
  }

  get positionZ(): IAudioParam {
    if (this._positionZ) {
      return this._positionZ;
    }

    this._positionZ = this.createObjectReference('positionZ', [], (id) => new AudioParam(id, this.context, 'k-rate', 0));
    return this._positionZ;
  }

  get upX(): IAudioParam {
    if (this._upX) {
      return this._upX;
    }

    this._upX = this.createObjectReference('upX', [], (id) => new AudioParam(id, this.context, 'k-rate', 0));
    return this._upX;
  }

  get upY(): IAudioParam {
    if (this._upY) {
      return this._upY;
    }

    this._upY = this.createObjectReference('upY', [], (id) => new AudioParam(id, this.context, 'k-rate', 1));
    return this._upY;
  }

  get upZ(): IAudioParam {
    if (this._upZ) {
      return this._upZ;
    }

    this._upZ = this.createObjectReference('upZ', [], (id) => new AudioParam(id, this.context, 'k-rate', 0));
    return this._upZ;
  }

  setOrientation(x: number, y: number, z: number, xUp: number, yUp: number, zUp: number): void {
    this[TransferrableKeys.mutated]('setOrientation', arguments);
  }

  setPosition(x: number, y: number, z: number): void {
    this[TransferrableKeys.mutated]('setPosition', arguments);
  }
}
