import { AudioScheduledSourceNode } from './AudioScheduledSourceNode';
import { ConstantSourceOptions, IAudioParam, IConstantSourceNode } from '../AudioTypes';
import { BaseAudioContext } from '../BaseAudioContext';
import { AudioParam } from '../AudioParam';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class ConstantSourceNode extends AudioScheduledSourceNode implements IConstantSourceNode {
  private _offset: IAudioParam;
  private readonly _offsetDefaultValue: number;

  // https://developer.mozilla.org/en-US/docs/Web/API/ConstantSourceNode
  constructor(context: BaseAudioContext, options: ConstantSourceOptions = {}, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'ConstantSourceNode', [...arguments]);

    super(id, context, 0, 1, {});

    this._offsetDefaultValue = options.offset || 1.0;
  }

  get offset(): IAudioParam {
    if (this._offset) {
      return this._offset;
    }

    this._offset = this.createObjectReference('offset', [], (id) => new AudioParam(id, this.context, 'a-rate', this._offsetDefaultValue));
    return this._offset;
  }
}
