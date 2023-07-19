let audioCtx;

const startBtn = document.getElementById('create');
const susresBtn = document.getElementById('suspend');
const stopBtn = document.getElementById('stop');

const timeDisplay = document.getElementById('info');

susresBtn.setAttribute('disabled', 'disabled');
stopBtn.setAttribute('disabled', 'disabled');

startBtn.onclick = () => {
  startBtn.setAttribute('disabled', 'disabled');
  susresBtn.removeAttribute('disabled');
  stopBtn.removeAttribute('disabled');

  // Create web audio api context
  audioCtx = new AudioContext();

  // Create an Oscillator and a Gain node
  const oscillator = new OscillatorNode(audioCtx, {
    type: 'square',
    frequency: 100, // Value in Herz
  });
  const gainNode = new GainNode(audioCtx, { gain: 0.1 });

  // Connect both nodes to the speakers

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Now that everything is connected, starts the sound
  oscillator.start(0);

  // Report the state of the audio context to the
  // console, when it changes

  audioCtx.onstatechange = function () {
    console.log(audioCtx.state);
  };
};

// Suspend/resume the audiocontext
susresBtn.onclick = () => {
  if (audioCtx.state === 'running') {
    audioCtx.suspend().then(() => {
      susresBtn.textContent = 'Resume context';
    });
  } else if (audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      susresBtn.textContent = 'Suspend context';
    });
  }
};

// Close the audiocontext
stopBtn.onclick = () => {
  audioCtx.close().then(() => {
    startBtn.removeAttribute('disabled');
    susresBtn.setAttribute('disabled', 'disabled');
    // Reset the text of the suspend/resume toggle:
    susresBtn.textContent = 'Suspend context';
    stopBtn.setAttribute('disabled', 'disabled');
  });
};

// Helper function
function displayTime() {
  if (audioCtx && audioCtx.state !== 'closed') {
    timeDisplay.textContent = `Current context time: ${audioCtx.currentTime.toFixed(3)}`;
  } else {
    timeDisplay.textContent = 'Current context time: No context exists.';
  }
  requestAnimationFrame(displayTime);
}

displayTime();
