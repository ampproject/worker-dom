import { Phase } from '../transfer/Phase';

export let phase: Phase = Phase.Initializing;
export const set = (newPhase: Phase) => (phase = newPhase);
