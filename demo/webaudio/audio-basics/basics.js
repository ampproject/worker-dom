console.clear();

// instigate our audio context
let audioCtx;

// load some sound
const audioElement = document.querySelector('audio');
let track;

const playButton = document.querySelector('.tape-controls-play');

// play pause audio
playButton.addEventListener(
  'click',
  () => {
    if (!audioCtx) {
      init();
    }

    // check if context is in suspended state (autoplay policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    let playing = playButton.getAttribute('playing') === 'true';

    if (!playing) {
      audioElement.play();
      playButton.setAttribute('playing', 'true');
      // if track is playing pause it
    } else {
      audioElement.pause();
      playButton.setAttribute('playing', 'false');
    }

    // Toggle the state between play and not playing
    let state = playButton.getAttribute('aria-checked') === 'true' ? true : false;
    playButton.setAttribute('aria-checked', state ? 'false' : 'true');
  },
  false,
);

// If track ends
audioElement.addEventListener(
  'ended',
  () => {
    playButton.setAttribute('playing', 'false');
    playButton.setAttribute('aria-checked', 'false');
  },
  false,
);

function init() {
  audioCtx = new AudioContext();

  track = new MediaElementAudioSourceNode(audioCtx, {
    mediaElement: audioElement,
  });

  // Create the node that controls the volume.
  const gainNode = new GainNode(audioCtx);

  const volumeControl = document.getElementById('volume');
  volumeControl.addEventListener(
    'input',
    () => {
      gainNode.gain.value = volumeControl.value;
    },
    false,
  );

  // Create the node that controls the panning
  const panner = new StereoPannerNode(audioCtx, { pan: 0 });

  const pannerControl = document.getElementById('panner');
  pannerControl.addEventListener(
    'input',
    () => {
      panner.pan.value = pannerControl.value;
    },
    false,
  );

  // connect our graph
  track.connect(gainNode).connect(panner).connect(audioCtx.destination);
}
