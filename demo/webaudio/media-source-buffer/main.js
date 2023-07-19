let audioCtx;
const audioElement = document.querySelector('audio');

audioElement.addEventListener('play', () => {
  audioCtx = new AudioContext();
  // Create a MediaElementAudioSourceNode
  // Feed the HTMLMediaElement into it
  let source = new MediaElementAudioSourceNode(audioCtx, {
    mediaElement: audioElement,
  });

  // Create a gain node
  let gainNode = new GainNode(audioCtx);

  // Create variables to store mouse pointer Y coordinate
  // and HEIGHT of screen
  let currentY;
  let height = window.innerHeight;

  // Get new mouse pointer coordinates when mouse is moved
  // then set new gain value

  document.addEventListener('mousemove', (e) => {
    currentY = window.Event
      ? e.pageY
      : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

    gainNode.gain.value = currentY / height;
  });

  // connect the AudioBufferSourceNode to the gainNode
  // and the gainNode to the destination, so we can play the
  // music and adjust the volume using the mouse cursor
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
});
