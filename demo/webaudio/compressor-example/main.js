const audioElt = document.querySelector('audio');
const pre = document.querySelector('pre');
const button = document.querySelector('button');
let audioCtx;

audioElt.addEventListener('play', () => {
  if (!audioCtx) {
    // Set up AudioContext
    audioCtx = new AudioContext();

    // Create a MediaElementAudioSourceNode
    // Feed the HTMLMediaElement into it
    const source = new MediaElementAudioSourceNode(audioCtx, {
      mediaElement: audioElt,
    });

    // Create a compressor node
    const compressor = new DynamicsCompressorNode(audioCtx, {
      threshold: -50,
      knee: 40,
      ratio: 12,
      attack: 0,
      release: 0.25,
    });

    // connect the AudioBufferSourceNode to the destination
    source.connect(audioCtx.destination);

    button.onclick = () => {
      const active = button.getAttribute('data-active');
      if (active === 'false') {
        button.setAttribute('data-active', 'true');
        button.textContent = 'Remove compression';

        source.disconnect(audioCtx.destination);
        source.connect(compressor);
        compressor.connect(audioCtx.destination);
      } else if (active === 'true') {
        button.setAttribute('data-active', 'false');
        button.textContent = 'Add compression';

        source.disconnect(compressor);
        compressor.disconnect(audioCtx.destination);
        source.connect(audioCtx.destination);
      }
    };
  }
});
