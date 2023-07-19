// set up listener and panner position information
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let xPos = Math.floor(WIDTH / 2);
let yPos = Math.floor(HEIGHT / 2);
let zPos = 295;

let leftBound;
let rightBound;
let xIterator;

let rightLoop;
let leftLoop;
let zoomInLoop;
let zoomOutLoop;

// play, stop, and other important dom nodes

const playBtn = document.querySelector('.play');
const stopBtn = document.querySelector('.stop');
const boomBox = document.querySelector('.boom-box');
const listenerData = document.querySelector('.listener-data');
const pannerData = document.querySelector('.panner-data');
const pulseWrapper = document.querySelector('.pulse-wrapper');

//  movement controls and initial data

const leftButton = document.querySelector('.left');
const rightButton = document.querySelector('.right');
const zoomInButton = document.querySelector('.zoom-in');
const zoomOutButton = document.querySelector('.zoom-out');

let boomX = 0;
let boomY = 0;
let boomZoom = 0.5;

// Variables to hold information that needs to be assigned upon play
// Audio context must be created only after the user has interacted.
let audioCtx;
let panner;
let listener;
let source;

function init() {
  audioCtx = new AudioContext();
  listener = audioCtx.listener;
  console.log(listener);

  panner = new PannerNode(audioCtx, {
    panningModel: 'HRTF',
    distanceModel: 'inverse',
    refDistance: 1,
    maxDistance: 10000,
    rolloffFactor: 1,
    coneInnerAngle: 360,
    coneOuterAngle: 0,
    coneOuterGain: 0,
    orientationX: 1,
    orientationY: 0,
    orientationZ: 0,
  });

  if (!listener.forwardX) {
    // Deprecated but still needed (July 2022)
    listener.setOrientation(0, 0, -1, 0, 1, 0);
  } else {
    // Standard way
    listener.forwardX.value = 0;
    listener.forwardY.value = 0;
    listener.forwardZ.value = -1;
    listener.upX.value = 0;
    listener.upY.value = 1;
    listener.upZ.value = 0;
  }

  leftBound = -xPos + 50;
  rightBound = xPos - 50;

  xIterator = WIDTH / 150;

  // listener will always be in the same place for this demo

  if (!listener.positionX) {
    // Deprecated but still needed (July 2022)
    listener.setPosition(xPos, yPos, 300);
  } else {
    // Standard way
    listener.positionX.value = xPos;
    listener.positionY.value = yPos;
    listener.positionZ.value = 300;
  }

  listenerData.textContent = `Listener data: X ${xPos} Y ${yPos} Z ${300}`;

  // panner will move as the boombox graphic moves around on the screen
  function positionPanner() {
    panner.positionX.value = xPos;
    panner.positionY.value = yPos;
    panner.positionZ.value = zPos;
    pannerData.textContent = `Panner data: X ${xPos} Y ${yPos} Z ${300}`;
  }

  // Fetch an audio track, decode it and stick it in a buffer.
  // Then we put the buffer into the source and start it
  function getData() {
    fetch('http://localhost:3001/webaudio/panner-node/viper.mp3')
      .then((response) => response.arrayBuffer())
      .then((downloadedBuffer) => audioCtx.decodeAudioData(downloadedBuffer))
      .then((decodedBuffer) => {
        source = new AudioBufferSourceNode(audioCtx, {
          buffer: decodedBuffer,
        });
        source.connect(panner);
        panner.connect(audioCtx.destination);
        positionPanner();
        source.loop = true;
        console.log('Loaded!');
        source.start(0);
      })
      .catch((e) => {
        console.error(`Error while preparing the audio data ${e.err}`);
      });
  }

  getData();

  // controls to move left and right past the boom box
  // and zoom in and out
  function moveRight() {
    boomX += -xIterator;
    xPos += -0.066;

    if (boomX <= leftBound) {
      boomX = leftBound;
      xPos = WIDTH / 2 - 5;
    }

    boomBox.style.transform = `translate(${boomX}px, ${boomY}px) scale(${boomZoom})`;
    positionPanner();
    rightLoop = requestAnimationFrame(moveRight);
    return rightLoop;
  }

  function moveLeft() {
    boomX += xIterator;
    xPos += 0.066;

    if (boomX > rightBound) {
      boomX = rightBound;
      xPos = WIDTH / 2 + 5;
    }

    positionPanner();
    boomBox.style.transform = `translate(${boomX}px, ${boomY}px) scale(${boomZoom})`;
    leftLoop = requestAnimationFrame(moveLeft);
    return leftLoop;
  }

  function zoomIn() {
    boomZoom += 0.05;
    zPos += 0.066;

    if (boomZoom > 4) {
      boomZoom = 4;
      zPos = 299.9;
    }

    positionPanner();
    boomBox.style.transform = `translate(${boomX}px, ${boomY}px) scale(${boomZoom})`;
    zoomInLoop = requestAnimationFrame(zoomIn);
    return zoomInLoop;
  }

  function zoomOut() {
    boomZoom += -0.05;
    zPos += -0.066;

    if (boomZoom <= 0.5) {
      boomZoom = 0.5;
      zPos = 295;
    }

    positionPanner();
    boomBox.style.transform = boomBox.style.transform = `translate(${boomX}px, ${boomY}px) scale(${boomZoom})`;
    zoomOutLoop = requestAnimationFrame(zoomOut);
    return zoomOutLoop;
  }

  // In each of the cases below, onmousedown runs the functions above
  // onmouseup cancels the resulting requestAnimationFrames.
  leftButton.onmousedown = moveLeft;
  leftButton.onmouseup = () => {
    cancelAnimationFrame(leftLoop);
  };

  rightButton.onmousedown = moveRight;
  rightButton.onmouseup = () => {
    cancelAnimationFrame(rightLoop);
  };

  zoomInButton.onmousedown = zoomIn;
  zoomInButton.onmouseup = () => {
    window.cancelAnimationFrame(zoomInLoop);
  };

  zoomOutButton.onmousedown = zoomOut;
  zoomOutButton.onmouseup = () => {
    window.cancelAnimationFrame(zoomOutLoop);
  };
}

// Wire up buttons to stop and play audio
stopBtn.disabled = true;

playBtn.onclick = () => {
  init();
  playBtn.disabled = true;
  stopBtn.disabled = false;
  pulseWrapper.classList.add('pulsate');
};

stopBtn.onclick = () => {
  source.stop(0);
  playBtn.disabled = false;
  stopBtn.disabled = true;
  pulseWrapper.classList.remove('pulsate');
};
