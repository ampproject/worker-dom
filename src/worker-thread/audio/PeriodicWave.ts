import { TransferrableAudio } from './TransferrableAudio';
import { IPeriodicWave, PeriodicWaveOptions } from './AudioTypes';
import { BaseAudioContext } from './BaseAudioContext';
import { createWindowObjectReferenceConstructor } from '../object-reference';

export class PeriodicWave extends TransferrableAudio implements IPeriodicWave {
  constructor(context: BaseAudioContext, options?: PeriodicWaveOptions, id?: number) {
    id = id || createWindowObjectReferenceConstructor(context.document, 'PeriodicWave', [...arguments]);

    super(id, context.document);
  }
}
