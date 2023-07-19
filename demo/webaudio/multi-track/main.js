console.clear();

let audioCtx = null;

// Provide a start button so demo can load tracks from an event handler for cross-browser compatibility
const startButton = document.querySelector('#startbutton');
console.log(startButton);

// Select all list elements
const trackEls = document.querySelectorAll('li');
console.log(trackEls);

// Loading function for fetching the audio file and decode the data
async function getFile(filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

// Function to call each file and return an array of decoded files
async function loadFile(filePath) {
  const track = await getFile(filePath);
  return track;
}

let offset = 0;

// Create a buffer, plop in data, connect and play -> modify graph here if required
function playTrack(audioBuffer) {
  const trackSource = new AudioBufferSourceNode(audioCtx, {
    buffer: audioBuffer,
  });
  trackSource.connect(audioCtx.destination);

  if (offset == 0) {
    trackSource.start();
    offset = audioCtx.currentTime;
  } else {
    trackSource.start(0, audioCtx.currentTime - offset);
  }

  return trackSource;
}

startButton.addEventListener('click', () => {
  if (audioCtx != null) {
    return;
  }

  audioCtx = new AudioContext();

  document.querySelector('#startbutton').hidden = true;

  trackEls.forEach((el, i) => {
    // Get children
    const anchor = el.querySelector('a');
    const loadText = el.querySelector('p');
    const playButton = el.querySelector('.playbutton');

    // Load file
    loadFile(anchor.href).then((track) => {
      // Hide loading text
      loadText.style.display = 'none';

      // Show button
      playButton.style.display = 'inline-block';

      // Allow play on click
      playButton.addEventListener('click', () => {
        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        playTrack(track);
        playButton.classList.add('loading');
        playButton.classList.remove('ready');
      });
    });
  });
});
