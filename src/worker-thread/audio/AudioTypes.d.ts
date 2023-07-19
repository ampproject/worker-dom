import { HTMLMediaElement } from '../dom/HTMLMediaElement';

export type ChannelCountMode = 'clamped-max' | 'explicit' | 'max';
export type ChannelInterpretation = 'discrete' | 'speakers';
export type AutomationRate = 'a-rate' | 'k-rate';
export type AudioContextState = 'closed' | 'running' | 'suspended';
export type AudioContextLatencyCategory = 'balanced' | 'interactive' | 'playback';
export type BiquadFilterType = 'allpass' | 'bandpass' | 'highpass' | 'highshelf' | 'lowpass' | 'lowshelf' | 'notch' | 'peaking';
export type MediaStreamTrackState = 'ended' | 'live';
export type OverSampleType = '2x' | '4x' | 'none';
export type OscillatorType = 'custom' | 'sawtooth' | 'sine' | 'square' | 'triangle';
export type DistanceModelType = 'exponential' | 'inverse' | 'linear';
export type PanningModelType = 'HRTF' | 'equalpower';

export type ConstrainDouble = number | ConstrainDoubleRange;
export type ConstrainULong = number | ConstrainULongRange;
export type ConstrainBoolean = boolean | ConstrainBooleanParameters;

export type ConstrainDOMString = string | string[] | ConstrainDOMStringParameters;

interface ConstrainBooleanParameters {
  exact?: boolean;
  ideal?: boolean;
}

interface ConstrainDOMStringParameters {
  exact?: string | string[];
  ideal?: string | string[];
}

interface ConstrainDoubleRange extends DoubleRange {
  exact?: number;
  ideal?: number;
}

interface ConstrainULongRange extends ULongRange {
  exact?: number;
  ideal?: number;
}

/** The Web Audio API's AudioParam interface represents an audio-related parameter, usually a parameter of an AudioNode (such as GainNode.gain). */
export interface IAudioParam {
  automationRate: AutomationRate;
  readonly defaultValue: number;
  readonly maxValue: number;
  readonly minValue: number;
  value: number;

  cancelAndHoldAtTime(cancelTime: number): IAudioParam;

  cancelScheduledValues(cancelTime: number): IAudioParam;

  exponentialRampToValueAtTime(value: number, endTime: number): IAudioParam;

  linearRampToValueAtTime(value: number, endTime: number): IAudioParam;

  setTargetAtTime(target: number, startTime: number, timeConstant: number): IAudioParam;

  setValueAtTime(value: number, startTime: number): IAudioParam;

  setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): IAudioParam;
}

export declare var AudioParam: {
  prototype: IAudioParam;
  new (): IAudioParam;
};

export interface BaseAudioContextEventMap {
  statechange: Event;
}

/** A generic interface for representing an audio processing module. Examples include: */
export interface IAudioNode extends EventTarget {
  channelCount: number;
  channelCountMode: ChannelCountMode;
  channelInterpretation: ChannelInterpretation;
  readonly context: IBaseAudioContext;
  readonly numberOfInputs: number;
  readonly numberOfOutputs: number;

  connect(destinationNode: IAudioNode, output?: number, input?: number): IAudioNode;

  connect(destinationParam: IAudioParam, output?: number): void;

  disconnect(): void;

  disconnect(output: number): void;

  disconnect(destinationNode: IAudioNode): void;

  disconnect(destinationNode: IAudioNode, output: number): void;

  disconnect(destinationNode: IAudioNode, output: number, input: number): void;

  disconnect(destinationParam: IAudioParam): void;

  disconnect(destinationParam: IAudioParam, output: number): void;
}

export declare var AudioNode: {
  prototype: IAudioNode;
  new (): IAudioNode;
};

/** A MediaElementSourceNode has no inputs and exactly one output, and is created using the AudioContext.createMediaElementSource method. The amount of channels in the output equals the number of channels of the audio referenced by the HTMLMediaElement used in the creation of the node, or is 1 if the HTMLMediaElement has no audio. */
export interface IMediaElementAudioSourceNode extends IAudioNode {
  readonly mediaElement: HTMLMediaElement;
}

export interface MediaElementAudioSourceOptions extends AudioNodeOptions {
  mediaElement: HTMLMediaElement;
}

export declare var MediaElementAudioSourceNode: {
  prototype: IMediaElementAudioSourceNode;
  new (context: IAudioContext, options: MediaElementAudioSourceOptions): IMediaElementAudioSourceNode;
};

interface WorkerOptions {
  credentials?: RequestCredentials;
  name?: string;
  type?: WorkerType;
}

interface WorkletOptions {
  credentials?: RequestCredentials;
}

/** Available only in secure contexts. */
interface Worklet {
  /**
   * Loads and executes the module script given by moduleURL into all of worklet's global scopes. It can also create additional global scopes as part of this process, depending on the worklet type. The returned promise will fulfill once the script has been successfully loaded and run in all global scopes.
   *
   * The credentials option can be set to a credentials mode to modify the script-fetching process. It defaults to "same-origin".
   *
   * Any failures in fetching the script or its dependencies will cause the returned promise to be rejected with an "AbortError" DOMException. Any errors in parsing the script or its dependencies will cause the returned promise to be rejected with the exception generated during parsing.
   */
  addModule(moduleURL: string | URL, options?: WorkletOptions): Promise<void>;
}

declare var Worklet: {
  prototype: Worklet;
  new (): Worklet;
};

/** Available only in secure contexts. */
export interface IAudioWorklet extends Worklet {}

export declare var AudioWorklet: {
  prototype: IAudioWorklet;
  new (): IAudioWorklet;
};

export interface AudioWorkletNodeEventMap {
  processorerror: Event;
}

export interface AudioNodeOptions {
  channelCount?: number;
  channelCountMode?: ChannelCountMode;
  channelInterpretation?: ChannelInterpretation;
}

export interface AudioWorkletNodeOptions extends AudioNodeOptions {
  numberOfInputs?: number;
  numberOfOutputs?: number;
  outputChannelCount?: number[];
  parameterData?: Record<string, number>;
  processorOptions?: any;
}

interface AudioParamMap {
  forEach(callbackfn: (value: IAudioParam, key: string, parent: AudioParamMap) => void, thisArg?: any): void;
}

declare var AudioParamMap: {
  prototype: AudioParamMap;
  new (): AudioParamMap;
};

/** Available only in secure contexts. */
export interface IAudioWorkletNode extends IAudioNode {
  onprocessorerror: ((this: IAudioWorkletNode, ev: Event) => any) | null;
  readonly parameters: AudioParamMap;
  readonly port: MessagePort;

  addEventListener<K extends keyof AudioWorkletNodeEventMap>(
    type: K,
    listener: (this: IAudioWorkletNode, ev: AudioWorkletNodeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof AudioWorkletNodeEventMap>(
    type: K,
    listener: (this: IAudioWorkletNode, ev: AudioWorkletNodeEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export declare var AudioWorkletNode: {
  prototype: IAudioWorkletNode;
  new (context: IBaseAudioContext, name: string, options?: AudioWorkletNodeOptions): IAudioWorkletNode;
};

/** AudioDestinationNode has no output (as it is the output, no more AudioNode can be linked after it in the audio graph) and one input. The number of channels in the input must be between 0 and the maxChannelCount value or an exception is raised. */
export interface IAudioDestinationNode extends IAudioNode {
  readonly maxChannelCount: number;
}

export declare var AudioDestinationNode: {
  prototype: IAudioDestinationNode;
  new (): IAudioDestinationNode;
};

/** The position and orientation of the unique person listening to the audio scene, and is used in audio spatialization. All PannerNodes spatialize in relation to the AudioListener stored in the BaseAudioContext.listener attribute. */
export interface IAudioListener {
  readonly forwardX: IAudioParam;
  readonly forwardY: IAudioParam;
  readonly forwardZ: IAudioParam;
  readonly positionX: IAudioParam;
  readonly positionY: IAudioParam;
  readonly positionZ: IAudioParam;
  readonly upX: IAudioParam;
  readonly upY: IAudioParam;
  readonly upZ: IAudioParam;

  /** @deprecated */
  setOrientation(x: number, y: number, z: number, xUp: number, yUp: number, zUp: number): void;

  /** @deprecated */
  setPosition(x: number, y: number, z: number): void;
}

export declare var AudioListener: {
  prototype: IAudioListener;
  new (): IAudioListener;
};

/** A node able to provide real-time frequency and time-domain analysis information. It is an AudioNode that passes the audio stream unchanged from the input to the output, but allows you to take the generated data, process it, and create audio visualizations. */
export interface IAnalyserNode extends IAudioNode {
  fftSize: number;
  readonly frequencyBinCount: number;
  maxDecibels: number;
  minDecibels: number;
  smoothingTimeConstant: number;

  getByteFrequencyData(array: Uint8Array): void;

  getByteTimeDomainData(array: Uint8Array): void;

  getFloatFrequencyData(array: Float32Array): void;

  getFloatTimeDomainData(array: Float32Array): void;
}

declare var AnalyserNode: {
  prototype: IAnalyserNode;
  new (context: IBaseAudioContext, options?: AnalyserOptions): IAnalyserNode;
};

interface MediaStreamEventMap {
  addtrack: MediaStreamTrackEvent;
  removetrack: MediaStreamTrackEvent;
}

/** Events which indicate that a MediaStream has had tracks added to or removed from the stream through calls to Media Stream API methods. These events are sent to the stream when these changes occur. */
interface MediaStreamTrackEvent extends Event {
  readonly track: IMediaStreamTrack;
}

export interface AnalyserOptions extends AudioNodeOptions {
  fftSize?: number;
  maxDecibels?: number;
  minDecibels?: number;
  smoothingTimeConstant?: number;
}

export interface IMediaStreamAudioDestinationNode extends IAudioNode {
  readonly stream: IMediaStream;
}

export declare var MediaStreamAudioDestinationNode: {
  prototype: IMediaStreamAudioDestinationNode;
  new (context: IAudioContext, options?: AudioNodeOptions): IMediaStreamAudioDestinationNode;
};

/** A short audio asset residing in memory, created from an audio file using the AudioContext.decodeAudioData() method, or from raw data using AudioContext.createBuffer(). Once put into an AudioBuffer, the audio can then be played by being passed into an AudioBufferSourceNode. */
interface IAudioBuffer {
  readonly duration: number;
  readonly length: number;
  readonly numberOfChannels: number;
  readonly sampleRate: number;

  copyFromChannel(destination: Float32Array, channelNumber: number, bufferOffset?: number): void;

  copyToChannel(source: Float32Array, channelNumber: number, bufferOffset?: number): void;

  getChannelData(channel: number): Float32Array;
}

declare var AudioBuffer: {
  prototype: IAudioBuffer;
  new (options: AudioBufferOptions): IAudioBuffer;
};

interface AudioBufferOptions {
  duration?: number;
  length: number;
  numberOfChannels?: number;
  sampleRate: number;
}

interface MediaStreamTrackEventMap {
  ended: Event;
  mute: Event;
  unmute: Event;
}

/** A stream of media content. A stream consists of several tracks such as video or audio tracks. Each track is specified as an instance of MediaStreamTrack. */
interface IMediaStream extends EventTarget {
  readonly active: boolean;
  readonly id: string;
  onaddtrack: ((this: IMediaStream, ev: MediaStreamTrackEvent) => any) | null;
  onremovetrack: ((this: IMediaStream, ev: MediaStreamTrackEvent) => any) | null;

  addTrack(track: IMediaStreamTrack): void;

  clone(): IMediaStream;

  getAudioTracks(): IMediaStreamTrack[];

  getTrackById(trackId: string): IMediaStreamTrack | null;

  getTracks(): IMediaStreamTrack[];

  getVideoTracks(): IMediaStreamTrack[];

  removeTrack(track: IMediaStreamTrack): void;

  addEventListener<K extends keyof MediaStreamEventMap>(
    type: K,
    listener: (this: IMediaStream, ev: MediaStreamEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof MediaStreamEventMap>(
    type: K,
    listener: (this: IMediaStream, ev: MediaStreamEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var MediaStream: {
  prototype: IMediaStream;
  new (): IMediaStream;
  new (stream: IMediaStream): IMediaStream;
  new (tracks: IMediaStreamTrack[]): IMediaStream;
};

interface MediaTrackConstraints extends MediaTrackConstraintSet {
  advanced?: MediaTrackConstraintSet[];
}

interface MediaTrackConstraintSet {
  aspectRatio?: ConstrainDouble;
  autoGainControl?: ConstrainBoolean;
  channelCount?: ConstrainULong;
  deviceId?: ConstrainDOMString;
  echoCancellation?: ConstrainBoolean;
  facingMode?: ConstrainDOMString;
  frameRate?: ConstrainDouble;
  groupId?: ConstrainDOMString;
  height?: ConstrainULong;
  latency?: ConstrainDouble;
  noiseSuppression?: ConstrainBoolean;
  sampleRate?: ConstrainULong;
  sampleSize?: ConstrainULong;
  suppressLocalAudioPlayback?: ConstrainBoolean;
  width?: ConstrainULong;
}

interface MediaTrackCapabilities {
  aspectRatio?: DoubleRange;
  autoGainControl?: boolean[];
  channelCount?: ULongRange;
  cursor?: string[];
  deviceId?: string;
  displaySurface?: string;
  echoCancellation?: boolean[];
  facingMode?: string[];
  frameRate?: DoubleRange;
  groupId?: string;
  height?: ULongRange;
  latency?: DoubleRange;
  logicalSurface?: boolean;
  noiseSuppression?: boolean[];
  resizeMode?: string[];
  sampleRate?: ULongRange;
  sampleSize?: ULongRange;
  width?: ULongRange;
}

interface ULongRange {
  max?: number;
  min?: number;
}

interface DoubleRange {
  max?: number;
  min?: number;
}

interface MediaTrackSettings {
  aspectRatio?: number;
  autoGainControl?: boolean;
  deviceId?: string;
  echoCancellation?: boolean;
  facingMode?: string;
  frameRate?: number;
  groupId?: string;
  height?: number;
  noiseSuppression?: boolean;
  restrictOwnAudio?: boolean;
  sampleRate?: number;
  sampleSize?: number;
  width?: number;
}

/** A single media track within a stream; typically, these are audio or video tracks, but other track types may exist as well. */
interface IMediaStreamTrack extends EventTarget {
  contentHint: string;
  enabled: boolean;
  readonly id: string;
  readonly kind: string;
  readonly label: string;
  readonly muted: boolean;
  onended: ((this: IMediaStreamTrack, ev: Event) => any) | null;
  onmute: ((this: IMediaStreamTrack, ev: Event) => any) | null;
  onunmute: ((this: IMediaStreamTrack, ev: Event) => any) | null;
  readonly readyState: MediaStreamTrackState;

  applyConstraints(constraints?: MediaTrackConstraints): Promise<void>;

  clone(): IMediaStreamTrack;

  getCapabilities(): MediaTrackCapabilities;

  getConstraints(): MediaTrackConstraints;

  getSettings(): MediaTrackSettings;

  stop(): void;

  addEventListener<K extends keyof MediaStreamTrackEventMap>(
    type: K,
    listener: (this: IMediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof MediaStreamTrackEventMap>(
    type: K,
    listener: (this: IMediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var MediaStreamTrack: {
  prototype: IMediaStreamTrack;
  new (): IMediaStreamTrack;
};

/** A type of AudioNode which operates as an audio source whose media is received from a MediaStream obtained using the WebRTC or Media Capture and Streams APIs. */
interface IMediaStreamAudioSourceNode extends IAudioNode {
  readonly mediaStream: IMediaStream;
}

declare var MediaStreamAudioSourceNode: {
  prototype: IMediaStreamAudioSourceNode;
  new (context: IAudioContext, options: MediaStreamAudioSourceOptions): IMediaStreamAudioSourceNode;
};

interface MediaStreamAudioSourceOptions {
  mediaStream: IMediaStream;
}

interface AudioTimestamp {
  contextTime?: number;
  performanceTime?: DOMHighResTimeStamp;
}

interface AudioContextOptions {
  latencyHint?: AudioContextLatencyCategory | number;
  sampleRate?: number;
}

/** A simple low-order filter, and is created using the AudioContext.createBiquadFilter() method. It is an AudioNode that can represent different kinds of filters, tone control devices, and graphic equalizers. */
interface IBiquadFilterNode extends IAudioNode {
  readonly Q: IAudioParam;
  readonly detune: IAudioParam;
  readonly frequency: IAudioParam;
  readonly gain: IAudioParam;
  type: BiquadFilterType;

  getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;
}

declare var BiquadFilterNode: {
  prototype: IBiquadFilterNode;
  new (context: IBaseAudioContext, options?: BiquadFilterOptions): IBiquadFilterNode;
};

interface BiquadFilterOptions extends AudioNodeOptions {
  Q?: number;
  detune?: number;
  frequency?: number;
  gain?: number;
  type?: BiquadFilterType;
}

/** An AudioScheduledSourceNode which represents an audio source consisting of in-memory audio data, stored in an AudioBuffer. It's especially useful for playing back audio which has particularly stringent timing accuracy requirements, such as for sounds that must match a specific rhythm and can be kept in memory rather than being played from disk or the network. */
interface IAudioBufferSourceNode extends IAudioScheduledSourceNode {
  buffer: IAudioBuffer | null;
  readonly detune: IAudioParam;
  loop: boolean;
  loopEnd: number;
  loopStart: number;
  readonly playbackRate: IAudioParam;

  start(when?: number, offset?: number, duration?: number): void;

  addEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: IAudioBufferSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: IAudioBufferSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface AudioScheduledSourceNodeEventMap {
  ended: Event;
}

interface AudioBufferSourceOptions extends AudioNodeOptions {
  buffer?: IAudioBuffer | null;
  detune?: number;
  loop?: boolean;
  loopEnd?: number;
  loopStart?: number;
  playbackRate?: number;
}

declare var AudioBufferSourceNode: {
  prototype: IAudioBufferSourceNode;
  new (context: IBaseAudioContext, options?: AudioBufferSourceOptions): IAudioBufferSourceNode;
};

interface IAudioScheduledSourceNode extends IAudioNode {
  onended: ((this: IAudioScheduledSourceNode, ev: Event) => any) | null;

  start(when?: number): void;

  stop(when?: number): void;

  addEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: IAudioScheduledSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: IAudioScheduledSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var AudioScheduledSourceNode: {
  prototype: IAudioScheduledSourceNode;
  new (): IAudioScheduledSourceNode;
};

interface IChannelMergerNode extends IAudioNode {}

declare var ChannelMergerNode: {
  prototype: IChannelMergerNode;
  new (context: IBaseAudioContext, options?: ChannelMergerOptions): IChannelMergerNode;
};

interface ChannelMergerOptions extends AudioNodeOptions {
  numberOfInputs?: number;
}

/** The ChannelSplitterNode interface, often used in conjunction with its opposite, ChannelMergerNode, separates the different channels of an audio source into a set of mono outputs. This is useful for accessing each channel separately, e.g. for performing channel mixing where gain must be separately controlled on each channel. */
interface IChannelSplitterNode extends IAudioNode {}

declare var ChannelSplitterNode: {
  prototype: IChannelSplitterNode;
  new (context: IBaseAudioContext, options?: ChannelSplitterOptions): IChannelSplitterNode;
};

interface ChannelSplitterOptions extends AudioNodeOptions {
  numberOfOutputs?: number;
}

interface IConstantSourceNode extends IAudioScheduledSourceNode {
  readonly offset: IAudioParam;

  addEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: IConstantSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: IConstantSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var ConstantSourceNode: {
  prototype: IConstantSourceNode;
  new (context: IBaseAudioContext, options?: ConstantSourceOptions): IConstantSourceNode;
};

/** An AudioNode that performs a Linear Convolution on a given AudioBuffer, often used to achieve a reverb effect. A ConvolverNode always has exactly one input and one output. */
interface IConvolverNode extends IAudioNode {
  buffer: IAudioBuffer | null;
  normalize: boolean;
}

interface ConstantSourceOptions {
  offset?: number;
}

declare var ConvolverNode: {
  prototype: IConvolverNode;
  new (context: IBaseAudioContext, options?: ConvolverOptions): IConvolverNode;
};

interface ConvolverOptions extends AudioNodeOptions {
  buffer?: IAudioBuffer | null;
  disableNormalization?: boolean;
}

/** A delay-line; an AudioNode audio-processing module that causes a delay between the arrival of an input data and its propagation to the output. */
interface IDelayNode extends IAudioNode {
  readonly delayTime: IAudioParam;
}

declare var DelayNode: {
  prototype: IDelayNode;
  new (context: IBaseAudioContext, options?: DelayOptions): IDelayNode;
};

interface DelayOptions extends AudioNodeOptions {
  delayTime?: number;
  maxDelayTime?: number;
}

/** Inherits properties from its parent, AudioNode. */
interface IDynamicsCompressorNode extends IAudioNode {
  readonly attack: IAudioParam;
  readonly knee: IAudioParam;
  readonly ratio: IAudioParam;
  readonly reduction: number;
  readonly release: IAudioParam;
  readonly threshold: IAudioParam;
}

declare var DynamicsCompressorNode: {
  prototype: IDynamicsCompressorNode;
  new (context: IBaseAudioContext, options?: DynamicsCompressorOptions): IDynamicsCompressorNode;
};

interface DynamicsCompressorOptions extends AudioNodeOptions {
  attack?: number;
  knee?: number;
  ratio?: number;
  release?: number;
  threshold?: number;
}

/** A change in volume. It is an AudioNode audio-processing module that causes a given gain to be applied to the input data before its propagation to the output. A GainNode always has exactly one input and one output, both with the same number of channels. */
interface IGainNode extends IAudioNode {
  readonly gain: IAudioParam;
}

declare var GainNode: {
  prototype: IGainNode;
  new (context: IBaseAudioContext, options?: GainOptions): IGainNode;
};

interface GainOptions extends AudioNodeOptions {
  gain?: number;
}

interface IIRFilterOptions extends AudioNodeOptions {
  feedback?: number[];
  feedforward?: number[];
}

/** The IIRFilterNode interface of the Web Audio API is a AudioNode processor which implements a general infinite impulse response (IIR)  filter; this type of filter can be used to implement tone control devices and graphic equalizers as well. It lets the parameters of the filter response be specified, so that it can be tuned as needed. */
interface IIIRFilterNode extends IAudioNode {
  getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;
}

declare var IIRFilterNode: {
  prototype: IIIRFilterNode;
  new (context: IBaseAudioContext, options: IIRFilterOptions): IIIRFilterNode;
};

/** The OscillatorNode interface represents a periodic waveform, such as a sine wave. It is an AudioScheduledSourceNode audio-processing module that causes a specified frequency of a given wave to be created—in effect, a constant tone. */
interface IOscillatorNode extends IAudioScheduledSourceNode {
  readonly detune: IAudioParam;
  readonly frequency: IAudioParam;
  type: OscillatorType;

  setPeriodicWave(periodicWave: IPeriodicWave): void;

  addEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: IOscillatorNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: IOscillatorNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var OscillatorNode: {
  prototype: IOscillatorNode;
  new (context: IBaseAudioContext, options?: OscillatorOptions): IOscillatorNode;
};

interface OscillatorOptions extends AudioNodeOptions {
  detune?: number;
  frequency?: number;
  periodicWave?: IPeriodicWave;
  type?: OscillatorType;
}

/** A PannerNode always has exactly one input and one output: the input can be mono or stereo but the output is always stereo (2 channels); you can't have panning effects without at least two audio channels! */
interface IPannerNode extends IAudioNode {
  coneInnerAngle: number;
  coneOuterAngle: number;
  coneOuterGain: number;
  distanceModel: DistanceModelType;
  maxDistance: number;
  readonly orientationX: IAudioParam;
  readonly orientationY: IAudioParam;
  readonly orientationZ: IAudioParam;
  panningModel: PanningModelType;
  readonly positionX: IAudioParam;
  readonly positionY: IAudioParam;
  readonly positionZ: IAudioParam;
  refDistance: number;
  rolloffFactor: number;

  /** @deprecated */
  setOrientation(x: number, y: number, z: number): void;

  /** @deprecated */
  setPosition(x: number, y: number, z: number): void;
}

declare var PannerNode: {
  prototype: IPannerNode;
  new (context: IBaseAudioContext, options?: PannerOptions): IPannerNode;
};

interface PannerOptions extends AudioNodeOptions {
  coneInnerAngle?: number;
  coneOuterAngle?: number;
  coneOuterGain?: number;
  distanceModel?: DistanceModelType;
  maxDistance?: number;
  orientationX?: number;
  orientationY?: number;
  orientationZ?: number;
  panningModel?: PanningModelType;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  refDistance?: number;
  rolloffFactor?: number;
}

interface PeriodicWaveConstraints {
  disableNormalization?: boolean;
}

interface PeriodicWaveOptions extends PeriodicWaveConstraints {
  imag?: number[] | Float32Array;
  real?: number[] | Float32Array;
}

/** The pan property takes a unitless value between -1 (full left pan) and 1 (full right pan). This interface was introduced as a much simpler way to apply a simple panning effect than having to use a full PannerNode. */
interface IStereoPannerNode extends IAudioNode {
  readonly pan: IAudioParam;
}

declare var StereoPannerNode: {
  prototype: IStereoPannerNode;
  new (context: IBaseAudioContext, options?: StereoPannerOptions): IStereoPannerNode;
};

interface StereoPannerOptions extends AudioNodeOptions {
  pan?: number;
}

/**
 * The Web Audio API events that occur when a ScriptProcessorNode input buffer is ready to be processed.
 * @deprecated As of the August 29 2014 Web Audio API spec publication, this feature has been marked as deprecated, and is soon to be replaced by AudioWorklet.
 */
interface IAudioProcessingEvent extends Event {
  /** @deprecated */
  readonly inputBuffer: IAudioBuffer;
  /** @deprecated */
  readonly outputBuffer: IAudioBuffer;
  /** @deprecated */
  readonly playbackTime: number;
}

/** @deprecated */
declare var AudioProcessingEvent: {
  prototype: IAudioProcessingEvent;
  new (type: string, eventInitDict: IAudioProcessingEventInit): IAudioProcessingEvent;
};

interface IAudioProcessingEventInit extends EventInit {
  inputBuffer: IAudioBuffer;
  outputBuffer: IAudioBuffer;
  playbackTime: number;
}

interface ScriptProcessorNodeEventMap {
  audioprocess: IAudioProcessingEvent;
}

/**
 * Allows the generation, processing, or analyzing of audio using JavaScript.
 * @deprecated As of the August 29 2014 Web Audio API spec publication, this feature has been marked as deprecated, and was replaced by AudioWorklet (see AudioWorkletNode).
 */
interface IScriptProcessorNode extends IAudioNode {
  /** @deprecated */
  readonly bufferSize: number;
  /** @deprecated */
  onaudioprocess: ((this: IScriptProcessorNode, ev: IAudioProcessingEvent) => any) | null;

  addEventListener<K extends keyof ScriptProcessorNodeEventMap>(
    type: K,
    listener: (this: IScriptProcessorNode, ev: ScriptProcessorNodeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof ScriptProcessorNodeEventMap>(
    type: K,
    listener: (this: IScriptProcessorNode, ev: ScriptProcessorNodeEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

/** @deprecated */
declare var ScriptProcessorNode: {
  prototype: IScriptProcessorNode;
  new (): IScriptProcessorNode;
};

/** A WaveShaperNode always has exactly one input and one output. */
interface IWaveShaperNode extends IAudioNode {
  curve: Float32Array | null;
  oversample: OverSampleType;
}

interface WaveShaperOptions extends AudioNodeOptions {
  curve?: number[] | Float32Array;
  oversample?: OverSampleType;
}

declare var WaveShaperNode: {
  prototype: IWaveShaperNode;
  new (context: IBaseAudioContext, options?: WaveShaperOptions): IWaveShaperNode;
};

/** PeriodicWave has no inputs or outputs; it is used to define custom oscillators when calling OscillatorNode.setPeriodicWave(). The PeriodicWave itself is created/returned by AudioContext.createPeriodicWave(). */
interface IPeriodicWave {}

declare var PeriodicWave: {
  prototype: IPeriodicWave;
  new (context: IBaseAudioContext, options?: PeriodicWaveOptions): IPeriodicWave;
};

interface DecodeErrorCallback {
  (error: DOMException): void;
}

interface DecodeSuccessCallback {
  (decodedData: IAudioBuffer): void;
}

export interface IBaseAudioContext extends EventTarget {
  /** Available only in secure contexts. */
  readonly audioWorklet: IAudioWorklet;
  readonly currentTime: number;
  readonly destination: IAudioDestinationNode;
  readonly listener: IAudioListener;
  onstatechange: ((this: IBaseAudioContext, ev: Event) => any) | null;
  readonly sampleRate: number;
  readonly state: AudioContextState;

  createAnalyser(): IAnalyserNode;

  createBiquadFilter(): IBiquadFilterNode;

  createBuffer(numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer;

  createBufferSource(): IAudioBufferSourceNode;

  createChannelMerger(numberOfInputs?: number): IChannelMergerNode;

  createChannelSplitter(numberOfOutputs?: number): IChannelSplitterNode;

  createConstantSource(): IConstantSourceNode;

  createConvolver(): IConvolverNode;

  createDelay(maxDelayTime?: number): IDelayNode;

  createDynamicsCompressor(): IDynamicsCompressorNode;

  createGain(): IGainNode;

  createIIRFilter(feedforward: number[], feedback: number[]): IIIRFilterNode;

  createOscillator(): IOscillatorNode;

  createPanner(): IPannerNode;

  createPeriodicWave(real: number[] | Float32Array, imag: number[] | Float32Array, constraints?: PeriodicWaveConstraints): IPeriodicWave;

  /** @deprecated */
  createScriptProcessor(bufferSize?: number, numberOfInputChannels?: number, numberOfOutputChannels?: number): IScriptProcessorNode;

  createStereoPanner(): IStereoPannerNode;

  createWaveShaper(): IWaveShaperNode;

  decodeAudioData(
    audioData: ArrayBuffer,
    successCallback?: DecodeSuccessCallback | null,
    errorCallback?: DecodeErrorCallback | null,
  ): Promise<IAudioBuffer>;

  addEventListener<K extends keyof BaseAudioContextEventMap>(
    type: K,
    listener: (this: IBaseAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof BaseAudioContextEventMap>(
    type: K,
    listener: (this: IBaseAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export declare var BaseAudioContext: {
  prototype: IBaseAudioContext;
  new (): IBaseAudioContext;
};

/** An audio-processing graph built from audio modules linked together, each represented by an AudioNode. */
export interface IAudioContext extends IBaseAudioContext {
  readonly baseLatency: number;
  readonly outputLatency: number;

  close(): Promise<void>;

  createMediaElementSource(mediaElement: HTMLMediaElement): IMediaElementAudioSourceNode;

  createMediaStreamDestination(): IMediaStreamAudioDestinationNode;

  createMediaStreamSource(mediaStream: IMediaStream): IMediaStreamAudioSourceNode;

  getOutputTimestamp(): AudioTimestamp;

  resume(): Promise<void>;

  suspend(): Promise<void>;

  addEventListener<K extends keyof BaseAudioContextEventMap>(
    type: K,
    listener: (this: IAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof BaseAudioContextEventMap>(
    type: K,
    listener: (this: IAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export declare var AudioContext: {
  prototype: IAudioContext;
  new (contextOptions?: AudioContextOptions): IAudioContext;
};
