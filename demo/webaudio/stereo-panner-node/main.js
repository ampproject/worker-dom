// We cannot initialize it now, we need to do it after some user
// interaction.
let audioCtx;

// Useful UI elements
const audioElt = document.querySelector('audio');
const pre = document.querySelector('pre');

const panControl = document.querySelector('.panning-control');
const panValue = document.querySelector('.panning-value');

audioElt.addEventListener('play', () => {
  // Create audio context if it doesn't already exist
  // We can do this as their has been some user interaction
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  // Create a MediaElementAudioSourceNode
  // Feed the HTMLMediaElement into it
  let source = new MediaElementAudioSourceNode(audioCtx, {
    mediaElement: audioElt,
  });

  // Create a stereo panner
  let panNode = new StereoPannerNode(audioCtx);

  // Event handler function to increase panning to the right and left
  // when the slider is moved

  panControl.oninput = () => {
    panNode.pan.value = panControl.value;
    panValue.textContent = panControl.value;
  };

  // connect the AudioBufferSourceNode to the gainNode
  // and the gainNode to the destination, so we can play the
  // music and adjust the panning using the controls
  source.connect(panNode);
  panNode.connect(audioCtx.destination);
});
