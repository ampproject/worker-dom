import { AMP } from './amp/amp';
import { callFunctionMessageHandler, exportFunction } from './function';
import { CharacterData } from './dom/CharacterData';
import { Comment } from './dom/Comment';
import { deleteGlobals } from './amp/delete-globals';
import { Document } from './dom/Document';
import { DocumentFragment } from './dom/DocumentFragment';
import { DOMTokenList } from './dom/DOMTokenList';
import { Element } from './dom/Element';
import { Event as WorkerDOMEvent, FocusEvent, InputEvent, KeyboardEvent, MouseEvent, TouchEvent, WheelEvent } from './Event';
import { GlobalScope, WorkerDOMGlobalScope } from './WorkerDOMGlobalScope';
import { HTMLAnchorElement } from './dom/HTMLAnchorElement';
import { HTMLButtonElement } from './dom/HTMLButtonElement';
import { HTMLCanvasElement } from './dom/HTMLCanvasElement';
import { HTMLDataElement } from './dom/HTMLDataElement';
import { HTMLDataListElement } from './dom/HTMLDataListElement';
import { HTMLElement } from './dom/HTMLElement';
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
import { initialize } from './initialize';
import { MutationObserver } from './MutationObserver';
import { cafPolyfill, rafPolyfill } from './AnimationFrame';
import { SVGElement } from './dom/SVGElement';
import { Text } from './dom/Text';
import { wrap as longTaskWrap } from './long-task';
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

declare const WORKER_DOM_DEBUG: boolean;

const globalScope: GlobalScope = {
  innerWidth: 0,
  innerHeight: 0,
  CharacterData,
  Comment,
  Document,
  DocumentFragment,
  DOMTokenList,
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
export const workerDOM: WorkerDOMGlobalScope = (function (postMessage, addEventListener, removeEventListener) {
  const document = new Document(globalScope);
  // TODO(choumx): Avoid polluting Document's public API.
  document.postMessage = postMessage;
  document.addGlobalEventListener = addEventListener;
  document.removeGlobalEventListener = removeEventListener;

  document.isConnected = true;
  document.appendChild((document.body = document.createElement('body')));

  // TODO(choumx): Remove once defaultView contains all native worker globals.
  // Canvas's use of native OffscreenCanvas checks the existence of the property
  // on the WorkerDOMGlobalScope.
  globalScope.OffscreenCanvas = (self as any)['OffscreenCanvas'];
  globalScope.ImageBitmap = (self as any)['ImageBitmap'];

  return document.defaultView;
})(postMessage.bind(self) || noop, addEventListener.bind(self) || noop, removeEventListener.bind(self) || noop);

// Modify global scope by removing disallowed properties and wrapping `fetch()`.
(function (global: WorkerGlobalScope) {
  deleteGlobals(global);
  // Wrap global.fetch() with our longTask API.
  const originalFetch = global['fetch'];
  if (originalFetch) {
    try {
      Object.defineProperty(global, 'fetch', {
        enumerable: true,
        writable: true,
        configurable: true,
        value: longTaskWrap(workerDOM.document, originalFetch.bind(global)),
      });
    } catch (e) {
      console.warn(e);
    }
  }
})(self);

// Offer APIs like AMP.setState() on the global scope.
(self as any).AMP = new AMP(workerDOM.document);

// Allows for function invocation
(self as any).exportFunction = exportFunction;
addEventListener('message', (evt: MessageEvent) => callFunctionMessageHandler(evt, workerDOM.document));

export const hydrate: HydrateFunction = initialize;
