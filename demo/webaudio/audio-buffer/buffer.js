const button = document.querySelector('button');

let audioCtx;

// Stereo
let channels = 2;

function init() {
  audioCtx = new AudioContext();
}

button.onclick = () => {
  if (!audioCtx) {
    init();
  }

  // Create an empty two second stereo buffer at the
  // sample rate of the AudioContext
  const frameCount = audioCtx.sampleRate * 2.0;

  const buffer = new AudioBuffer({
    numberOfChannels: channels,
    length: frameCount,
    sampleRate: audioCtx.sampleRate,
  });

  // Fill the buffer with white noise;
  // just random values between -1.0 and 1.0
  for (let channel = 0; channel < channels; channel++) {
    // This gives us the actual array that contains the data
    const nowBuffering = new Float32Array(frameCount);
    for (let i = 0; i < frameCount; i++) {
      // Math.random() is in [0; 1.0]
      // audio needs to be in [-1.0; 1.0]
      nowBuffering[i] = Math.random() * 2 - 1;
    }
    buffer.copyToChannel(nowBuffering, channel);
  }

  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  const source = audioCtx.createBufferSource();
  // Set the buffer in the AudioBufferSourceNode
  source.buffer = buffer;
  // Connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  source.connect(audioCtx.destination);
  // start the source playing
  source.start();

  source.onended = () => {
    console.log('White noise finished.');
  };
};
