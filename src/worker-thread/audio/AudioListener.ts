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

    const id = this.createObjectReference('forwardX', []);
    this._forwardX = new AudioParam(id, this.context, 'k-rate', 0);
    return this._forwardX;
  }

  get forwardY(): IAudioParam {
    if (this._forwardY) {
      return this._forwardY;
    }

    const id = this.createObjectReference('forwardY', []);
    this._forwardY = new AudioParam(id, this.context, 'k-rate', 0);
    return this._forwardY;
  }

  get forwardZ(): IAudioParam {
    if (this._forwardZ) {
      return this._forwardZ;
    }

    const id = this.createObjectReference('forwardZ', []);
    this._forwardZ = new AudioParam(id, this.context, 'k-rate', -1);
    return this._forwardZ;
  }

  get positionX(): IAudioParam {
    if (this._positionX) {
      return this._positionX;
    }

    const id = this.createObjectReference('positionX', []);
    this._positionX = new AudioParam(id, this.context, 'k-rate', 0);
    return this._positionX;
  }

  get positionY(): IAudioParam {
    if (this._positionY) {
      return this._positionY;
    }

    const id = this.createObjectReference('positionY', []);
    this._positionY = new AudioParam(id, this.context, 'k-rate', 0);
    return this._positionY;
  }

  get positionZ(): IAudioParam {
    if (this._positionZ) {
      return this._positionZ;
    }

    const id = this.createObjectReference('positionZ', []);
    this._positionZ = new AudioParam(id, this.context, 'k-rate', 0);
    return this._positionZ;
  }

  get upX(): IAudioParam {
    if (this._upX) {
      return this._upX;
    }

    const id = this.createObjectReference('upX', []);
    this._upX = new AudioParam(id, this.context, 'k-rate', 0);
    return this._upX;
  }

  get upY(): IAudioParam {
    if (this._upY) {
      return this._upY;
    }

    const id = this.createObjectReference('upY', []);
    this._upY = new AudioParam(id, this.context, 'k-rate', 1);
    return this._upY;
  }

  get upZ(): IAudioParam {
    if (this._upZ) {
      return this._upZ;
    }

    const id = this.createObjectReference('upZ', []);
    this._upZ = new AudioParam(id, this.context, 'k-rate', 0);
    return this._upZ;
  }

  setOrientation(x: number, y: number, z: number, xUp: number, yUp: number, zUp: number): void {
    this[TransferrableKeys.mutated]('setOrientation', [...arguments]);
  }

  setPosition(x: number, y: number, z: number): void {
    this[TransferrableKeys.mutated]('setPosition', [...arguments]);
  }
}
