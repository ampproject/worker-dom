import { AudioNodeOptions, ChannelCountMode, ChannelInterpretation, IAudioNode, IAudioParam } from '../AudioTypes';
import { TransferrableAudio } from '../TransferrableAudio';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';
import { BaseAudioContext } from '../BaseAudioContext';

export abstract class AudioNode extends TransferrableAudio implements IAudioNode {
  private _channelCount: number;
  private _channelCountMode: ChannelCountMode;
  private _channelInterpretation: ChannelInterpretation;
  readonly context: BaseAudioContext;
  readonly numberOfInputs: number = 0;
  readonly numberOfOutputs: number = 0;

  constructor(id: number, context: BaseAudioContext, numberOfInputs: number, numberOfOutputs: number, options: AudioNodeOptions = {}) {
    super(id, context.document);
    this.context = context;
    this.numberOfInputs = numberOfInputs;
    this.numberOfOutputs = numberOfOutputs;

    this._channelCount = options.channelCount || 1;
    this._channelCountMode = options.channelCountMode || 'max';
    this._channelInterpretation = options.channelInterpretation || 'speakers';
  }

  get channelCount(): number {
    return this._channelCount;
  }

  set channelCount(value: number) {
    if (this._channelCount != value) {
      this.setProperty('channelCount', value);
      this._channelCount = value;
    }
  }

  get channelCountMode(): ChannelCountMode {
    return this._channelCountMode;
  }

  set channelCountMode(value: ChannelCountMode) {
    if (this._channelCountMode != value) {
      this.setProperty('channelCountMode', value);
      this._channelCountMode = value;
    }
  }

  get channelInterpretation(): ChannelInterpretation {
    return this._channelInterpretation;
  }

  set channelInterpretation(value: ChannelInterpretation) {
    if (this._channelInterpretation != value) {
      this.setProperty('channelInterpretation', value);
      this._channelInterpretation = value;
    }
  }

  connect(destinationNode: IAudioNode, output?: number, input?: number): IAudioNode;
  connect(destinationParam: IAudioParam, output?: number): void;
  connect(destinationNode: IAudioNode | IAudioParam, output?: number, input?: number): IAudioNode | void {
    this[TransferrableKeys.mutated]('connect', [...arguments]);

    if (destinationNode instanceof AudioNode) {
      return destinationNode as IAudioNode;
    }
    return undefined;
  }

  disconnect(): void;
  disconnect(output: number): void;
  disconnect(destinationNode: IAudioNode): void;
  disconnect(destinationNode: IAudioNode, output: number): void;
  disconnect(destinationNode: IAudioNode, output: number, input: number): void;
  disconnect(destinationParam: IAudioParam): void;
  disconnect(destinationParam: IAudioParam, output: number): void;
  disconnect(destinationNode?: number | IAudioNode | IAudioParam, output?: number, input?: number): void {
    this[TransferrableKeys.mutated]('disconnect', [...arguments]);
  }

  addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void {
    throw new Error('NOT IMPLEMENTED');
  }

  dispatchEvent(event: Event): boolean {
    throw new Error('NOT IMPLEMENTED');
  }

  removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void {
    throw new Error('NOT IMPLEMENTED');
  }
}
