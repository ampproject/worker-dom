// Define global variables
let audioCtx; // It can *only* be created after a user action.
let source; // We need the audio context to create it
let rAF; // Id of the current requestAnimationFrame() to remove it

// UI elements that we want to access
const playBtn = document.querySelector('#play');
const stopBtn = document.querySelector('#stop');
const output = document.querySelector('output');

// Fetch the audio track, then decode it into a buffer.
// Finally, use this buffer as the source of audio.
function getData() {
  console.log('Fetch the audio file…');
  fetch('http://localhost:3001/webaudio/output-timestamp/outfoxing.mp3')
    .then((response) => response.arrayBuffer())
    .then((downloadedBuffer) => audioCtx.decodeAudioData(downloadedBuffer))
    .then((decodedBuffer) => {
      source.buffer = decodedBuffer;
      source.connect(audioCtx.destination);
      source.loop = true;
      playBtn.disabled = true; // We are ready.
      console.log('Audio ready.');
    })
    .catch((e) => {
      console.error(`Error while reading the audio data: ${e.error}`);
    });
}

// Press the play button
playBtn.addEventListener('click', () => {
  // We can create the audioCtx as there has been some user action
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  source = new AudioBufferSourceNode(audioCtx);
  getData();
  source.start(0);
  playBtn.disabled = true;
  stopBtn.disabled = false;
  rAF = requestAnimationFrame(outputTimestamps);
});

// Press the stop button
stopBtn.addEventListener('click', () => {
  source.stop(0);
  playBtn.disabled = false;
  stopBtn.disabled = true;
  cancelAnimationFrame(rAF);
});

// Helper function to output timestamps
function outputTimestamps() {
  const ts = audioCtx.getOutputTimestamp();
  output.textContent = `Context time: ${ts.contextTime} | Performance time: ${ts.performanceTime}`;
  rAF = requestAnimationFrame(outputTimestamps); // Reregister itself
}
