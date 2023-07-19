import { BaseAudioContext } from './BaseAudioContext';
import {
  AudioContextOptions,
  AudioTimestamp,
  IAudioContext,
  IMediaElementAudioSourceNode,
  IMediaStream,
  IMediaStreamAudioDestinationNode,
  IMediaStreamAudioSourceNode,
} from './AudioTypes';
import { HTMLMediaElement } from '../dom/HTMLMediaElement';
import { callFunction } from '../function';
import { MediaElementAudioSourceNode } from './node/MediaElementAudioSourceNode';
import { Document } from '../dom/Document';
import { createWindowObjectReferenceConstructor } from '../object-reference';

export class AudioContext extends BaseAudioContext implements IAudioContext {
  readonly baseLatency: number = 0.015;
  readonly outputLatency: number = 0.015;
  static document: Document;

  constructor(contextOptions?: AudioContextOptions) {
    const id: number = createWindowObjectReferenceConstructor(AudioContext.document, 'AudioContext', [...arguments]);

    super(id, AudioContext.document);
  }

  close(): Promise<void> {
    // TODO: Delete reference in the main thread
    return callFunction(AudioContext.document, this, 'close', [], 0, true).then(() => {
      this.changeState('closed');
    });
  }

  createMediaElementSource(mediaElement: HTMLMediaElement): IMediaElementAudioSourceNode {
    const id = this.createObjectReference('createMediaElementSource', [...arguments]);
    return new MediaElementAudioSourceNode(
      this,
      {
        mediaElement,
      },
      id,
    );
  }

  createMediaStreamDestination(): IMediaStreamAudioDestinationNode {
    throw new Error('NOT IMPLEMENTED');
  }

  createMediaStreamSource(mediaStream: IMediaStream): IMediaStreamAudioSourceNode {
    throw new Error('NOT IMPLEMENTED');
  }

  getOutputTimestamp(): AudioTimestamp {
    return {
      contextTime: this.currentTime,
      performanceTime: performance.now() - this.document.creationTime,
    };
  }

  resume(): Promise<void> {
    return callFunction(AudioContext.document, this, 'resume', [], 0, true).then(() => {
      this.changeState('running');
    });
  }

  suspend(): Promise<void> {
    return callFunction(AudioContext.document, this, 'suspend', [], 0, true).then(() => {
      this.changeState('suspended');
    });
  }
}
