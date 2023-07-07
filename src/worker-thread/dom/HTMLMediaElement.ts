import { HTMLElement } from './HTMLElement';
import { reflectProperties, registerListenableProperties } from './enhanceElement';
import { transfer } from '../MutationTransfer';
import { Document } from './Document';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { store, store as storeString } from '../strings';
import { NumericBoolean } from '../../utils';
import { serializeTransferrableObject } from '../serializeTransferrableObject';
import { registerSubclass } from './Element';

export class HTMLMediaElement extends HTMLElement {
  private _paused: boolean = true;
  private _currentTime: number = 0;
  private _playTime: number = 0;
  private _loop = false;
  private _muted = false;
  private _volume = 1.0;
  private _playbackRate = 1.0;

  get currentTime(): number {
    if (!this.paused) {
      if (this.loop) {
        this._currentTime = ((Date.now() - this._playTime) / 1000) % this.duration;
      } else {
        this._currentTime = Math.min((Date.now() - this._playTime) / 1000, this.duration);
      }
    }
    return this._currentTime;
  }

  set currentTime(time: number) {
    if (this._currentTime === time) {
      return;
    }

    this._setProperty('currentTime', time, false);

    this.seeking = true;
    this._currentTime = time;

    if (!this.paused) {
      this._playTime = Date.now() - this._currentTime * 1000;
    }
  }

  public load() {
    this._callFunction('load', []);
    this._paused = true;
  }

  public play() {
    if (!this._paused) {
      return Promise.resolve();
    }

    this._callFunction('play', []);

    return Promise.resolve().then((_) => {
      this._playTime = Date.now();
      this._paused = false;
    });
  }

  get paused(): boolean {
    return this._paused;
  }

  public pause() {
    if (this._paused) {
      return;
    }
    this._callFunction('pause', []);
    this._currentTime = this.currentTime;
    this._paused = true;
  }

  get loop(): boolean {
    return this._loop;
  }

  set loop(value: boolean) {
    if (this._loop === !!value) {
      return;
    }
    this._loop = !!value;
    this._setProperty('loop', this._loop, true);
  }

  get playbackRate(): number {
    return this._playbackRate;
  }

  set playbackRate(value: number) {
    if (this._playbackRate === value) {
      return;
    }
    this._playbackRate = value;
    this._setProperty('playbackRate', this._playbackRate, false);
  }

  get muted(): boolean {
    return this._muted;
  }

  set muted(value: boolean) {
    if (this._muted === value) {
      return;
    }
    this._muted = !!value;
    this._setProperty('muted', this._muted, true);
  }

  get volume(): number {
    return this._volume;
  }

  set volume(value: number) {
    if (this._volume === value) {
      return;
    }
    this._volume = value;
    this._setProperty('volume', value, false);
  }

  private _setProperty(name: string, value: any, isBoolean: boolean) {
    transfer(this.ownerDocument as Document, [
      TransferrableMutationType.PROPERTIES,
      this[TransferrableKeys.index],
      storeString(name),
      isBoolean ? NumericBoolean.TRUE : NumericBoolean.FALSE,
      isBoolean ? (value ? NumericBoolean.TRUE : NumericBoolean.FALSE) : storeString(String(value)),
    ]);
  }

  private _callFunction(fnName: string, args: any[]) {
    transfer(this.ownerDocument as Document, [
      TransferrableMutationType.OBJECT_MUTATION,
      store(fnName),
      args.length, // arg count
      ...this[TransferrableKeys.serializeAsTransferrableObject](),
      ...serializeTransferrableObject(args),
    ]);
  }
}

registerSubclass('media', HTMLMediaElement);

reflectProperties(
  [
    { autoplay: [false] },
    { controls: [false] },
    { crossOrigin: [''] },
    { disableRemotePlayback: [false] },
    { preload: [''] },
    { preservesPitch: [false] },
    { src: [''] },
  ],
  HTMLMediaElement,
);

registerListenableProperties(
  {
    readyState: 0,
    duration: Number.NaN,
    currentSrc: '',
    seeking: false,
    seeked: false,
  },
  HTMLMediaElement,
);
