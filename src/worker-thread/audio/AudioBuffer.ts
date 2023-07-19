import { AudioBufferOptions, IAudioBuffer } from './AudioTypes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableAudio } from './TransferrableAudio';
import { createWindowObjectReferenceConstructor } from '../object-reference';
import { Document } from '../dom/Document';

export class AudioBuffer extends TransferrableAudio implements IAudioBuffer {
  readonly duration: number;
  readonly length: number;
  readonly numberOfChannels: number;
  readonly sampleRate: number;
  static document: Document;

  constructor(options: AudioBufferOptions, id?: number) {
    id = id || createWindowObjectReferenceConstructor(AudioBuffer.document, 'AudioBuffer', [options]);

    super(id, AudioBuffer.document);
    this.length = options.length;
    this.sampleRate = options.sampleRate;
    this.numberOfChannels = options.numberOfChannels || 1;
    this.duration = options.duration || this.length / this.sampleRate;
  }

  copyFromChannel(destination: Float32Array, channelNumber: number, bufferOffset?: number): void {
    throw new Error('NOT IMPLEMENTED');
  }

  copyToChannel(source: Float32Array, channelNumber: number, bufferOffset?: number): void {
    this[TransferrableKeys.mutated]('copyToChannel', [...arguments]);
  }

  getChannelData(channel: number): Float32Array {
    throw new Error('NOT IMPLEMENTED');
  }
}
