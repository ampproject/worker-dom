import { HTMLElement } from './dom/HTMLElement';
import { SVGElement } from './dom/SVGElement';
import { HTMLAnchorElement } from './dom/HTMLAnchorElement';
import { HTMLButtonElement } from './dom/HTMLButtonElement';
import { HTMLCanvasElement } from './dom/HTMLCanvasElement';
import { HTMLDataElement } from './dom/HTMLDataElement';
import { HTMLEmbedElement } from './dom/HTMLEmbedElement';
import { HTMLFieldSetElement } from './dom/HTMLFieldSetElement';
import { HTMLFormElement } from './dom/HTMLFormElement';
import { HTMLIFrameElement } from './dom/HTMLIFrameElement';
import { HTMLImageElement } from './dom/HTMLImageElement';
import { HTMLInputElement } from './dom/HTMLInputElement';
import { HTMLLabelElement } from './dom/HTMLLabelElement';
import { HTMLLinkElement } from './dom/HTMLLinkElement';
import { HTMLMapElement } from './dom/HTMLMapElement';
import { HTMLMeterElement } from './dom/HTMLMeterElement';
import { HTMLModElement } from './dom/HTMLModElement';
import { HTMLOListElement } from './dom/HTMLOListElement';
import { HTMLOptionElement } from './dom/HTMLOptionElement';
import { HTMLProgressElement } from './dom/HTMLProgressElement';
import { HTMLQuoteElement } from './dom/HTMLQuoteElement';
import { HTMLScriptElement } from './dom/HTMLScriptElement';
import { HTMLSelectElement } from './dom/HTMLSelectElement';
import { HTMLSourceElement } from './dom/HTMLSourceElement';
import { HTMLStyleElement } from './dom/HTMLStyleElement';
import { HTMLTableCellElement } from './dom/HTMLTableCellElement';
import { HTMLTableColElement } from './dom/HTMLTableColElement';
import { HTMLTableElement } from './dom/HTMLTableElement';
import { HTMLTableRowElement } from './dom/HTMLTableRowElement';
import { HTMLTableSectionElement } from './dom/HTMLTableSectionElement';
import { HTMLTimeElement } from './dom/HTMLTimeElement';
import { Document } from './dom/Document';
import { GlobalScope } from './WorkerDOMGlobalScope';
import { initialize } from './initialize';
import { MutationObserver } from './MutationObserver';
import { Event as WorkerDOMEvent, FocusEvent, InputEvent, KeyboardEvent, MouseEvent, TouchEvent, WheelEvent } from './Event';
import { Text } from './dom/Text';
import { HTMLDataListElement } from './dom/HTMLDataListElement';
import { CharacterData } from './dom/CharacterData';
import { Comment } from './dom/Comment';
import { DOMTokenList } from './dom/DOMTokenList';
import { DocumentFragment } from './dom/DocumentFragment';
import { Element } from './dom/Element';
import { cafPolyfill, rafPolyfill } from './AnimationFrame';
import { HydrateFunction } from './hydrate';
import { HTMLMediaElement } from './dom/HTMLMediaElement';
import { HTMLAudioElement } from './dom/HTMLAudioElement';
import { HTMLVideoElement } from './dom/HTMLVideoElement';
import { AudioContext } from './audio/AudioContext';
import { AnalyserNode } from './audio/node/AnalyserNode';
import { AudioBufferSourceNode } from './audio/node/AudioBufferSourceNode';
import { BiquadFilterNode } from './audio/node/BiquadFilterNode';
import { ChannelMergerNode } from './audio/node/ChannelMergerNode';
import { ChannelSplitterNode } from './audio/node/ChannelSplitterNode';
import { ConstantSourceNode } from './audio/node/ConstantSourceNode';
import { ConvolverNode } from './audio/node/ConvolverNode';
import { DelayNode } from './audio/node/DelayNode';
import { DynamicsCompressorNode } from './audio/node/DynamicsCompressorNode';
import { GainNode } from './audio/node/GainNode';
import { IIRFilterNode } from './audio/node/IIRFilterNode';
import { MediaElementAudioSourceNode } from './audio/node/MediaElementAudioSourceNode';
import { OscillatorNode } from './audio/node/OscillatorNode';
import { PannerNode } from './audio/node/PannerNode';
import { StereoPannerNode } from './audio/node/StereoPannerNode';
import { WaveShaperNode } from './audio/node/WaveShaperNode';
import { AudioBuffer } from './audio/AudioBuffer';
import { PeriodicWave } from './audio/PeriodicWave';

const globalScope: GlobalScope = {
  innerWidth: 0,
  innerHeight: 0,
  CharacterData,
  Comment,
  DOMTokenList,
  Document,
  DocumentFragment,
  Element,
  HTMLAnchorElement,
  HTMLButtonElement,
  HTMLCanvasElement,
  HTMLDataElement,
  HTMLDataListElement,
  HTMLElement,
  HTMLEmbedElement,
  HTMLFieldSetElement,
  HTMLFormElement,
  HTMLIFrameElement,
  HTMLImageElement,
  HTMLInputElement,
  HTMLLabelElement,
  HTMLLinkElement,
  HTMLMapElement,
  HTMLMeterElement,
  HTMLModElement,
  HTMLOListElement,
  HTMLOptionElement,
  HTMLProgressElement,
  HTMLQuoteElement,
  HTMLScriptElement,
  HTMLSelectElement,
  HTMLSourceElement,
  HTMLStyleElement,
  HTMLTableCellElement,
  HTMLTableColElement,
  HTMLTableElement,
  HTMLTableRowElement,
  HTMLTableSectionElement,
  HTMLTimeElement,
  SVGElement,
  HTMLMediaElement,
  HTMLAudioElement,
  HTMLVideoElement,
  Text,
  Event: WorkerDOMEvent,
  MouseEvent,
  TouchEvent,
  FocusEvent,
  KeyboardEvent,
  WheelEvent,
  InputEvent,
  MutationObserver,
  requestAnimationFrame: self.requestAnimationFrame || rafPolyfill,
  cancelAnimationFrame: self.cancelAnimationFrame || cafPolyfill,
  AudioContext,
  AnalyserNode,
  AudioBufferSourceNode,
  BiquadFilterNode,
  ChannelMergerNode,
  ChannelSplitterNode,
  ConstantSourceNode,
  ConvolverNode,
  DelayNode,
  DynamicsCompressorNode,
  GainNode,
  IIRFilterNode,
  OscillatorNode,
  PannerNode,
  StereoPannerNode,
  WaveShaperNode,
  AudioBuffer,
  PeriodicWave,
  MediaElementAudioSourceNode,
};

const noop = () => void 0;

// WorkerDOM.Document.defaultView ends up being the window object.
// React requires the classes to exist off the window object for instanceof checks.
export const workerDOM = (function (postMessage, addEventListener, removeEventListener) {
  const document = new Document(globalScope);
  // TODO(choumx): Avoid polluting Document's public API.
  document.postMessage = postMessage;
  document.addGlobalEventListener = addEventListener;
  document.removeGlobalEventListener = removeEventListener;

  // TODO(choumx): Remove once defaultView contains all native worker globals.
  // Canvas's use of native OffscreenCanvas checks the existence of the property
  // on the WorkerDOMGlobalScope.
  globalScope.OffscreenCanvas = (self as any)['OffscreenCanvas'];
  globalScope.ImageBitmap = (self as any)['ImageBitmap'];

  document.isConnected = true;
  document.appendChild((document.body = document.createElement('body')));

  AudioContext.document = document;
  AudioBuffer.document = document;

  return document.defaultView;
})(postMessage.bind(self) || noop, addEventListener.bind(self) || noop, removeEventListener.bind(self) || noop);

export const hydrate: HydrateFunction = initialize;
