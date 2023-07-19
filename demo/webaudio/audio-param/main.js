let audioCtx;

// set basic variables for example
const audioElt = document.querySelector('audio');
const pre = document.querySelector('pre');

const targetAtTimePlus = document.querySelector('.set-target-at-time-plus');
const targetAtTimeMinus = document.querySelector('.set-target-at-time-minus');
const linearRampPlus = document.querySelector('.linear-ramp-plus');
const linearRampMinus = document.querySelector('.linear-ramp-minus');
const expRampPlus = document.querySelector('.exp-ramp-plus');
const expRampMinus = document.querySelector('.exp-ramp-minus');
const atTimePlus = document.querySelector('.at-time-plus');
const atTimeMinus = document.querySelector('.at-time-minus');
const valueCurve = document.querySelector('.value-curve');

audioElt.addEventListener('play', () => {
  audioCtx = new AudioContext();

  // Create a MediaElementAudioSourceNode
  // Feed the HTMLMediaElement into it
  const source = new MediaElementAudioSourceNode(audioCtx, {
    mediaElement: audioElt,
  });

  // Create a gain node and set it's gain value to 0.5
  const gainNode = new GainNode(audioCtx, { gain: 0.5 });

  let currGain = gainNode.gain.value;

  // connect the AudioBufferSourceNode to the gainNode
  // and the gainNode to the destination
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // set buttons to do something onclick
  targetAtTimePlus.onclick = () => {
    currGain += 0.25;
    gainNode.gain.setValueAtTime(currGain, audioCtx.currentTime + 1);
  };

  targetAtTimeMinus.onclick = () => {
    currGain -= 0.25;
    gainNode.gain.setValueAtTime(currGain, audioCtx.currentTime + 1);
  };

  linearRampPlus.onclick = () => {
    currGain = 1.0;
    gainNode.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 2);
  };

  linearRampMinus.onclick = () => {
    currGain = 0;
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);
  };

  expRampPlus.onclick = () => {
    currGain = 1.0;
    gainNode.gain.exponentialRampToValueAtTime(1.0, audioCtx.currentTime + 2);
  };

  expRampMinus.onclick = () => {
    currGain = 0;
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);
  };

  atTimePlus.onclick = () => {
    currGain = 1.0;
    gainNode.gain.setTargetAtTime(1.0, audioCtx.currentTime + 1, 0.5);
  };

  atTimeMinus.onclick = () => {
    currGain = 0;
    gainNode.gain.setTargetAtTime(0, audioCtx.currentTime + 1, 0.5);
  };

  const waveArray = new Float32Array([0.5, 1, 0.5, 0, 0.5, 1, 0, 0.5]);
  valueCurve.onclick = () => {
    gainNode.gain.setValueCurveAtTime(waveArray, audioCtx.currentTime, 2);
  };
});
