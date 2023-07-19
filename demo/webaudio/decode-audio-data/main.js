// define variables
const audioCtx = new AudioContext();
let source;
let buffer;

const play = document.getElementById('play');
const stop = document.getElementById('stop');

const playbackControl = document.getElementById('playback-rate-control');
const playbackValue = document.getElementById('playback-rate-value');

const loopstartControl = document.getElementById('loopstart-control');
const loopstartValue = document.getElementById('loopstart-value');

const loopendControl = document.getElementById('loopend-control');
const loopendValue = document.getElementById('loopend-value');

function loadPage() {
  getAudio('viper');
}

// use XHR to load an audio file and
// decodeAudioData to decode it and stick it in in global buffer variable.
// We put the buffer into the source in play.onclick().
function getAudio(name) {
  fetch(`http://localhost:3001/webaudio/decode-audio-data/${name}.mp3`)
    .then((value) => value.arrayBuffer())
    .then((audioData) => {
      audioCtx.decodeAudioData(
        audioData,
        (buf) => {
          buffer = buf;
          const max = Math.floor(buf.duration); // in this case buf === global buffer
          loopstartControl.max = max;
          loopendControl.max = max;
          play.disabled = false;
        },
        (err) => {
          console.error(`Unable to get the audio file: ${name} Error: ${err.message}`);
        },
      );
    });
}

play.onclick = () => {
  source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = playbackControl.value;
  source.connect(audioCtx.destination);
  source.loop = true;
  source.start();
  play.disabled = true;
  playbackControl.disabled = false;
  loopstartControl.disabled = false;
  loopendControl.disabled = false;
};

stop.onclick = () => {
  source.stop();
  play.disabled = false;
  playbackControl.disabled = true;
  loopstartControl.disabled = true;
  loopendControl.disabled = true;
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

// window.addEventListener("load", loadPage, false);
loadPage();
