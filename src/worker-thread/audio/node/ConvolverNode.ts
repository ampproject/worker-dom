import { AudioNode } from './AudioNode';
import { ConvolverOptions, IAudioBuffer, IConvolverNode } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class ConvolverNode extends AudioNode implements IConvolverNode {
  private _buffer: IAudioBuffer | null;
  private _normalize: boolean;

  // https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode
  constructor(context: BaseAudioContext, options: ConvolverOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'ConvolverNode', arguments);
    super(id, context, 1, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'clamped-max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this._buffer = options.buffer || null;
    this._normalize = !(options.disableNormalization || false);
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

  get normalize(): boolean {
    return this._normalize;
  }

  set normalize(value: boolean) {
    if (this._normalize != value) {
      this.setProperty('normalize', value);
      this._normalize = value;
    }
  }
}
