import { Phase } from '../transfer/Phase.js';

export let phase: Phase = Phase.Initializing;
export const set = (newPhase: Phase) => (phase = newPhase);
