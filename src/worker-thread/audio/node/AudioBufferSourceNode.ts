import { AudioBufferSourceOptions, IAudioBuffer, IAudioBufferSourceNode, IAudioParam } from '../AudioTypes';
import { AudioScheduledSourceNode } from './AudioScheduledSourceNode';
import { BaseAudioContext } from '../BaseAudioContext';
import { AudioParam } from '../AudioParam';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class AudioBufferSourceNode extends AudioScheduledSourceNode implements IAudioBufferSourceNode {
  private _buffer: IAudioBuffer | null;
  private _detune: IAudioParam;
  private readonly _detuneDefaultValue: number;
  private _loop: boolean;
  private _loopEnd: number;
  private _loopStart: number;
  private _playbackRate: IAudioParam;
  private readonly _playbackRateDefaultValue: number;

  // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
  constructor(context: BaseAudioContext, options: AudioBufferSourceOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'AudioBufferSourceNode', [...arguments]);

    super(id, context, 0, 1, {
      channelCount: options.buffer ? options.buffer.numberOfChannels || 2 : 2,
      channelCountMode: options.channelCountMode || 'max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this._buffer = options.buffer || null;
    this._detuneDefaultValue = options.detune || 0;
    this._loop = options.loop || false;
    this._loopEnd = options.loopEnd || 0;
    this._loopStart = options.loopStart || 0;
    this._playbackRateDefaultValue = options.playbackRate || 1;
  }

  get detune(): IAudioParam {
    if (this._detune) {
      return this._detune;
    }

    this._detune = this.createObjectReference('detune', [], (id) => new AudioParam(id, this.context, 'k-rate', this._detuneDefaultValue));
    return this._detune;
  }

  get playbackRate(): IAudioParam {
    if (this._playbackRate) {
      return this._playbackRate;
    }

    this._playbackRate = this.createObjectReference(
      'playbackRate',
      [],
      (id) => new AudioParam(id, this.context, 'k-rate', this._playbackRateDefaultValue),
    );
    return this._playbackRate;
  }

  get buffer(): IAudioBuffer | null {
    return this._buffer;
  }

  set buffer(value: IAudioBuffer | null) {
    if (this._buffer != value) {
      this.setProperty('buffer', value);
      this._buffer = value;
    }
  }

  get loop(): boolean {
    return this._loop;
  }

  set loop(value: boolean) {
    if (this._loop != value) {
      this.setProperty('loop', value);
      this._loop = value;
    }
  }

  get loopEnd(): number {
    return this._loopEnd;
  }

  set loopEnd(value: number) {
    if (this._loopEnd != value) {
      this.setProperty('loopEnd', value);
      this._loopEnd = value;
    }
  }

  get loopStart(): number {
    return this._loopStart;
  }

  set loopStart(value: number) {
    if (this._loopStart != value) {
      this.setProperty('loopStart', value);
      this._loopStart = value;
    }
  }
}
