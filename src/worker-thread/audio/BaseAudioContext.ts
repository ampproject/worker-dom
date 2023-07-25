import {
  AudioContextState,
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
import { Document } from '../dom/Document';

export abstract class BaseAudioContext extends TransferrableAudio implements IBaseAudioContext {
  public readonly sampleRate: number = 48000; // TODO: implement

  private _currentTime: number = performance.now();
  private _audioWorklet: IAudioWorklet;
  private _destination: IAudioDestinationNode;
  private _listener: IAudioListener;
  private _state: AudioContextState = 'running'; // TODO: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state#resuming_interrupted_play_states_in_ios_safari

  constructor(id: number, document: Document, keys?: Array<string>) {
    keys = keys || [];
    keys.push('onstatechange');

    super(id, document, keys);
  }

  get audioWorklet(): IAudioWorklet {
    if (this._audioWorklet) {
      return this._audioWorklet;
    }
    this._audioWorklet = this.createObjectReference('audioWorklet', [], (id) => new AudioWorklet(id, this.document));
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

    this._destination = this.createObjectReference('destination', [], (id) => new AudioDestinationNode(id, this));
    return this._destination;
  }

  get listener(): IAudioListener {
    if (this._listener) {
      return this._listener;
    }

    this._listener = this.createObjectReference('listener', [], (id) => new AudioListener(id, this));
    return this._listener;
  }

  get state(): AudioContextState {
    return this._state;
  }

  createAnalyser(): IAnalyserNode {
    return this.createObjectReference('createAnalyser', [], (id) => new AnalyserNode(this, {}, id));
  }

  createBiquadFilter(): IBiquadFilterNode {
    return this.createObjectReference('createBiquadFilter', [], (id) => new BiquadFilterNode(this, {}, id));
  }

  createBuffer(numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer {
    return this.createObjectReference(
      'createBuffer',
      [...arguments],
      (id) =>
        new AudioBuffer(
          {
            numberOfChannels,
            length,
            sampleRate,
          },
          id,
        ),
    );
  }

  createBufferSource(): IAudioBufferSourceNode {
    return this.createObjectReference('createBufferSource', [], (id) => new AudioBufferSourceNode(this, {}, id));
  }

  createChannelMerger(numberOfInputs?: number): IChannelMergerNode {
    return this.createObjectReference(
      'createChannelMerger',
      [...arguments],
      (id) =>
        new ChannelMergerNode(
          this,
          {
            numberOfInputs,
          },
          id,
        ),
    );
  }

  createChannelSplitter(numberOfOutputs?: number): IChannelSplitterNode {
    return this.createObjectReference(
      'createChannelSplitter',
      [...arguments],
      (id) =>
        new ChannelSplitterNode(
          this,
          {
            numberOfOutputs,
          },
          id,
        ),
    );
  }

  createConstantSource(): IConstantSourceNode {
    return this.createObjectReference('createConstantSource', [], (id) => new ConstantSourceNode(this, {}, id));
  }

  createConvolver(): IConvolverNode {
    return this.createObjectReference('createConvolver', [], (id) => new ConvolverNode(this, {}, id));
  }

  createDelay(maxDelayTime?: number): IDelayNode {
    return this.createObjectReference(
      'createDelay',
      [...arguments],
      (id) =>
        new DelayNode(
          this,
          {
            maxDelayTime,
          },
          id,
        ),
    );
  }

  createDynamicsCompressor(): IDynamicsCompressorNode {
    return this.createObjectReference('createDynamicsCompressor', [], (id) => new DynamicsCompressorNode(this, {}, id));
  }

  createGain(): IGainNode {
    return this.createObjectReference('createGain', [], (id) => new GainNode(this, {}, id));
  }

  createIIRFilter(feedforward: number[], feedback: number[]): IIIRFilterNode {
    return this.createObjectReference(
      'createIIRFilter',
      [...arguments],
      (id) =>
        new IIRFilterNode(
          this,
          {
            feedforward,
            feedback,
          },
          id,
        ),
    );
  }

  createOscillator(): IOscillatorNode {
    return this.createObjectReference('createOscillator', [], (id) => new OscillatorNode(this, {}, id));
  }

  createPanner(): IPannerNode {
    return this.createObjectReference('createPanner', [], (id) => new PannerNode(this, {}, id));
  }

  createPeriodicWave(real: number[] | Float32Array, imag: number[] | Float32Array, constraints?: PeriodicWaveConstraints): IPeriodicWave {
    return this.createObjectReference(
      'createPeriodicWave',
      [...arguments],
      (id) =>
        new PeriodicWave(
          this,
          {
            real,
            imag,
            disableNormalization: constraints ? !!constraints.disableNormalization : true,
          },
          id,
        ),
    );
  }

  createScriptProcessor(bufferSize?: number, numberOfInputChannels?: number, numberOfOutputChannels?: number): IScriptProcessorNode {
    throw new Error('NOT IMPLEMENTED: DEPRECATED');
  }

  createStereoPanner(): IStereoPannerNode {
    return this.createObjectReference('createStereoPanner', [], (id) => new StereoPannerNode(this, {}, id));
  }

  createWaveShaper(): IWaveShaperNode {
    return this.createObjectReference('createWaveShaper', [], (id) => new WaveShaperNode(this, {}, id));
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
    }
  }
}
