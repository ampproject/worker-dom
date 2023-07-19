import { TransferrableAudio } from './TransferrableAudio';
import { IAudioWorklet, WorkletOptions } from './AudioTypes';
import { callFunction } from '../function';

export class AudioWorklet extends TransferrableAudio implements IAudioWorklet {
  addModule(moduleURL: string | URL, options?: WorkletOptions): Promise<void> {
    if (typeof moduleURL === 'object') {
      moduleURL = moduleURL.href;
    }
    return callFunction(this.document, this, 'addModule', [moduleURL, options], 0, true);
  }
}
