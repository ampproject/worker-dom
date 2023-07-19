import { AudioNode } from './AudioNode';
import { AnalyserOptions, IAnalyserNode } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class AnalyserNode extends AudioNode implements IAnalyserNode {
  readonly frequencyBinCount: number;

  // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
  constructor(context: BaseAudioContext, options: AnalyserOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'AnalyserNode', [...arguments]);

    super(id, context, 1, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this._fftSize = options.fftSize || 0;
    this._maxDecibels = options.maxDecibels || 0;
    this._minDecibels = options.minDecibels || 0;
    this._smoothingTimeConstant = options.smoothingTimeConstant || 0;
  }

  private _fftSize: number;

  get fftSize(): number {
    return this._fftSize;
  }

  set fftSize(value: number) {
    if (this._fftSize != value) {
      this.setProperty('fftSize', value);
      this._fftSize = value;
    }
  }

  private _maxDecibels: number;

  get maxDecibels(): number {
    return this._maxDecibels;
  }

  set maxDecibels(value: number) {
    if (this._maxDecibels != value) {
      this.setProperty('maxDecibels', value);
      this._maxDecibels = value;
    }
  }

  private _minDecibels: number;

  get minDecibels(): number {
    return this._minDecibels;
  }

  set minDecibels(value: number) {
    if (this._minDecibels != value) {
      this.setProperty('minDecibels', value);
      this._minDecibels = value;
    }
  }

  private _smoothingTimeConstant: number;

  get smoothingTimeConstant(): number {
    return this._smoothingTimeConstant;
  }

  set smoothingTimeConstant(value: number) {
    if (this._smoothingTimeConstant != value) {
      this.setProperty('smoothingTimeConstant', value);
      this._smoothingTimeConstant = value;
    }
  }

  getByteFrequencyData(array: Uint8Array): void {
    throw new Error('NOT IMPLEMENTED');
  }

  getByteTimeDomainData(array: Uint8Array): void {
    throw new Error('NOT IMPLEMENTED');
  }

  getFloatFrequencyData(array: Float32Array): void {
    throw new Error('NOT IMPLEMENTED');
  }

  getFloatTimeDomainData(array: Float32Array): void {
    throw new Error('NOT IMPLEMENTED');
  }
}
