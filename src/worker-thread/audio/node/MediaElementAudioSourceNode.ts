import { AudioNode } from './AudioNode';
import { IMediaElementAudioSourceNode, MediaElementAudioSourceOptions } from '../AudioTypes';
import { HTMLMediaElement } from '../../dom/HTMLMediaElement';
import { BaseAudioContext } from '../BaseAudioContext';
import { createWindowObjectReferenceConstructor } from '../../object-reference';

export class MediaElementAudioSourceNode extends AudioNode implements IMediaElementAudioSourceNode {
  readonly mediaElement: HTMLMediaElement;

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaElementAudioSourceNode

  constructor(context: BaseAudioContext, options: MediaElementAudioSourceOptions, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'MediaElementAudioSourceNode', [...arguments]);

    super(id, context, 0, 1, {
      channelCount: options.channelCount || 2,
      channelCountMode: options.channelCountMode || 'max',
      channelInterpretation: options.channelInterpretation || 'speakers',
    });

    this.mediaElement = options.mediaElement;
  }
}
