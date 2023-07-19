// define variables
const audioCtx = new AudioContext();
let buffer;
let source;

const play = document.querySelector('.play');
play.setAttribute('disabled', 'disabled');

const stop = document.querySelector('.stop');

const playbackControl = document.querySelector('.playback-rate-control');
const playbackValue = document.querySelector('.playback-rate-value');
playbackControl.setAttribute('disabled', 'disabled');

const loopstartControl = document.querySelector('.loopstart-control');
const loopstartValue = document.querySelector('.loopstart-value');
loopstartControl.setAttribute('disabled', 'disabled');

const loopendControl = document.querySelector('.loopend-control');
const loopendValue = document.querySelector('.loopend-value');
loopendControl.setAttribute('disabled', 'disabled');

function loadPage() {
  fetchAudio('viper').then((buf) => {
    // executes when buffer has been decoded
    const max = Math.floor(buf.duration); // in this case buf === global buffer
    loopstartControl.setAttribute('max', max);
    loopendControl.setAttribute('max', max);
    play.removeAttribute('disabled'); // buffer loaded, enable play button
  });
}

// use fetch() to load an audio file, and
// decodeAudioData to decode it and stick it in global buffer variable.
// We put the buffer into the source in play.onclick()
async function fetchAudio(name) {
  try {
    const rsvp = await fetch(`http://localhost:3001/webaudio/decode-audio-promise/${name}.mp3`);
    buffer = await audioCtx.decodeAudioData(await rsvp.arrayBuffer());
    return buffer; // returns a Promise, buffer is arg for .then((arg) => {})
  } catch (err) {
    console.error(`Unable to fetch the audio file: ${name}
error: ${err.message}`);
  }
}

play.onclick = () => {
  source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = playbackControl.value;
  source.connect(audioCtx.destination);
  source.loop = true;
  source.start();
  play.setAttribute('disabled', 'disabled');
  playbackControl.removeAttribute('disabled');
  loopstartControl.removeAttribute('disabled');
  loopendControl.removeAttribute('disabled');
};

stop.onclick = () => {
  source.stop();
  play.removeAttribute('disabled');
  playbackControl.setAttribute('disabled', 'disabled');
  loopstartControl.setAttribute('disabled', 'disabled');
  loopendControl.setAttribute('disabled', 'disabled');
};

playbackControl.oninput = () => {
  source.playbackRate.value = playbackControl.value;
  playbackValue.textContent = playbackControl.value;
};

loopstartControl.oninput = () => {
  source.loopStart = loopstartControl.value;
  loopstartValue.textContent = loopstartControl.value;
};

loopendControl.oninput = () => {
  source.loopEnd = loopendControl.value;
  loopendValue.textContent = loopendControl.value;
};

loadPage();
