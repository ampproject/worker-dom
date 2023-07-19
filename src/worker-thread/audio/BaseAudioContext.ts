import {
  AudioContextState,
  BaseAudioContextEventMap,
  DecodeErrorCallback,
  DecodeSuccessCallback,
  IAnalyserNode,
  IAudioBuffer,
  IAudioBufferSourceNode,
  IAudioDestinationNode,
  IAudioListener,
  IAudioWorklet,
  IBaseAudioContext,
  IBiquadFilterNode,
  IChannelMergerNode,
  IChannelSplitterNode,
  IConstantSourceNode,
  IConvolverNode,
  IDelayNode,
  IDynamicsCompressorNode,
  IGainNode,
  IIIRFilterNode,
  IOscillatorNode,
  IPannerNode,
  IPeriodicWave,
  IScriptProcessorNode,
  IStereoPannerNode,
  IWaveShaperNode,
  PeriodicWaveConstraints,
} from './AudioTypes';
import { TransferrableAudio } from './TransferrableAudio';
import { GainNode } from './node/GainNode';
import { AnalyserNode } from './node/AnalyserNode';
import { ChannelMergerNode } from './node/ChannelMergerNode';
import { ChannelSplitterNode } from './node/ChannelSplitterNode';
import { DelayNode } from './node/DelayNode';
import { PeriodicWave } from './PeriodicWave';
import { StereoPannerNode } from './node/StereoPannerNode';
import { OscillatorNode } from './node/OscillatorNode';
import { PannerNode } from './node/PannerNode';
import { BiquadFilterNode } from './node/BiquadFilterNode';
import { ConstantSourceNode } from './node/ConstantSourceNode';
import { DynamicsCompressorNode } from './node/DynamicsCompressorNode';
import { IIRFilterNode } from './node/IIRFilterNode';
import { AudioBuffer } from './AudioBuffer';
import { AudioBufferSourceNode } from './node/AudioBufferSourceNode';
import { WaveShaperNode } from './node/WaveShaperNode';
import { ConvolverNode } from './node/ConvolverNode';
import { callFunction } from '../function';
import { AudioDestinationNode } from './node/AudioDestinationNode';
import { AudioListener } from './AudioListener';
import { AudioWorklet } from './AudioWorklet';
import { nextObjectId } from '../object-reference';

export abstract class BaseAudioContext extends TransferrableAudio implements IBaseAudioContext {
  public readonly sampleRate: number = 48000; // TODO: implement
  public onstatechange: ((this: IBaseAudioContext, ev: Event) => any) | null;

  private _currentTime: number = performance.now();
  private _audioWorklet: IAudioWorklet;
  private _destination: IAudioDestinationNode;
  private _listener: IAudioListener;
  private _state: AudioContextState = 'running'; // TODO: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state#resuming_interrupted_play_states_in_ios_safari

  get audioWorklet(): IAudioWorklet {
    if (this._audioWorklet) {
      return this._audioWorklet;
    }

    const id = this.createObjectReference('audioWorklet', []);
    this._audioWorklet = new AudioWorklet(id, this.document);
    return this._audioWorklet;
  }

  get currentTime(): number {
    if (this._state === 'running') {
      return (performance.now() - this._currentTime) / 1000;
    } else {
      return this._currentTime / 1000;
    }
  }

  get destination(): IAudioDestinationNode {
    if (this._destination) {
      return this._destination;
    }

    const id = this.createObjectReference('destination', []);
    this._destination = new AudioDestinationNode(id, this);

    return this._destination;
  }

  get listener(): IAudioListener {
    if (this._listener) {
      return this._listener;
    }

    const id = this.createObjectReference('listener', []);
    this._listener = new AudioListener(id, this);

    return this._listener;
  }

  get state(): AudioContextState {
    return this._state;
  }

  createAnalyser(): IAnalyserNode {
    const id = this.createObjectReference('createAnalyser', []);
    return new AnalyserNode(this, {}, id);
  }

  createBiquadFilter(): IBiquadFilterNode {
    const id = this.createObjectReference('createBiquadFilter', []);
    return new BiquadFilterNode(this, {}, id);
  }

  createBuffer(numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer {
    const id = this.createObjectReference('createBuffer', [...arguments]);
    return new AudioBuffer(
      {
        numberOfChannels,
        length,
        sampleRate,
      },
      id,
    );
  }

  createBufferSource(): IAudioBufferSourceNode {
    const id = this.createObjectReference('createBufferSource', []);
    return new AudioBufferSourceNode(this, {}, id);
  }

  createChannelMerger(numberOfInputs?: number): IChannelMergerNode {
    const id = this.createObjectReference('createChannelMerger', [...arguments]);
    return new ChannelMergerNode(
      this,
      {
        numberOfInputs,
      },
      id,
    );
  }

  createChannelSplitter(numberOfOutputs?: number): IChannelSplitterNode {
    const id = this.createObjectReference('createChannelSplitter', [...arguments]);
    return new ChannelSplitterNode(
      this,
      {
        numberOfOutputs,
      },
      id,
    );
  }

  createConstantSource(): IConstantSourceNode {
    const id = this.createObjectReference('createConstantSource', []);
    return new ConstantSourceNode(this, {}, id);
  }

  createConvolver(): IConvolverNode {
    const id = this.createObjectReference('createConvolver', []);
    return new ConvolverNode(this, {}, id);
  }

  createDelay(maxDelayTime?: number): IDelayNode {
    const id = this.createObjectReference('createDelay', [...arguments]);
    return new DelayNode(
      this,
      {
        maxDelayTime,
      },
      id,
    );
  }

  createDynamicsCompressor(): IDynamicsCompressorNode {
    const id = this.createObjectReference('createDynamicsCompressor', []);
    return new DynamicsCompressorNode(this, {}, id);
  }

  createGain(): IGainNode {
    const gainId = this.createObjectReference('createGain', []);
    return new GainNode(this, {}, gainId);
  }

  createIIRFilter(feedforward: number[], feedback: number[]): IIIRFilterNode {
    const id = this.createObjectReference('createIIRFilter', [...arguments]);
    return new IIRFilterNode(
      this,
      {
        feedforward,
        feedback,
      },
      id,
    );
  }

  createOscillator(): IOscillatorNode {
    const id = this.createObjectReference('createOscillator', []);
    return new OscillatorNode(this, {}, id);
  }

  createPanner(): IPannerNode {
    const id = this.createObjectReference('createPanner', []);
    return new PannerNode(this, {}, id);
  }

  createPeriodicWave(real: number[] | Float32Array, imag: number[] | Float32Array, constraints?: PeriodicWaveConstraints): IPeriodicWave {
    const id = this.createObjectReference('createPeriodicWave', [...arguments]);
    return new PeriodicWave(
      this,
      {
        real,
        imag,
        disableNormalization: constraints ? !!constraints.disableNormalization : true,
      },
      id,
    );
  }

  createScriptProcessor(bufferSize?: number, numberOfInputChannels?: number, numberOfOutputChannels?: number): IScriptProcessorNode {
    throw new Error('NOT IMPLEMENTED: DEPRECATED');
  }

  createStereoPanner(): IStereoPannerNode {
    const id = this.createObjectReference('createStereoPanner', []);
    return new StereoPannerNode(this, {}, id);
  }

  createWaveShaper(): IWaveShaperNode {
    const id = this.createObjectReference('createWaveShaper', []);
    return new WaveShaperNode(this, {}, id);
  }

  decodeAudioData(
    audioData: ArrayBuffer,
    successCallback?: DecodeSuccessCallback | null,
    errorCallback?: DecodeErrorCallback | null,
  ): Promise<IAudioBuffer> {
    const id = nextObjectId();
    return callFunction(this.document, this, 'decodeAudioData', [audioData, '__successCallback__', '__errorCallback__'], 0, true, id)
      .then((value) => {
        const buffer = new AudioBuffer(
          {
            duration: value.duration,
            length: value.length,
            numberOfChannels: value.numberOfChannels,
            sampleRate: value._sampleRate,
          },
          id,
        );
        if (successCallback) {
          successCallback(buffer);
        }
        return buffer;
      })
      .catch((reason) => {
        if (errorCallback) {
          errorCallback(new DOMException(reason));
        }
        return reason;
      });
  }

  protected changeState(value: AudioContextState): void {
    if (this._state != value) {
      if (value === 'suspended') {
        this._currentTime = this.currentTime * 1000;
      } else if (value === 'running') {
        this._currentTime = performance.now() - this._currentTime;
      }
      this._state = value;

      if (this.onstatechange) {
        this.onstatechange(new Event('statechange', {}));
      }
    }
  }

  dispatchEvent(event: Event): boolean {
    throw new Error('NOT IMPLEMENTED');
  }

  addEventListener<K extends keyof BaseAudioContextEventMap>(
    type: K,
    listener: (this: BaseAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
  addEventListener(
    type: string | keyof BaseAudioContextEventMap,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    throw new Error('NOT IMPLEMENTED');
  }

  removeEventListener<K extends keyof BaseAudioContextEventMap>(
    type: K,
    listener: (this: BaseAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
  removeEventListener(
    type: string | keyof BaseAudioContextEventMap,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void {
    throw new Error('NOT IMPLEMENTED');
  }
}
