document.getElementById('video').addEventListener('click', () => {
  const video = document.createElement('video');
  video.controls = true;
  video.muted = true;

  const webmSource = document.createElement('source');
  webmSource.src = './video/flower.webm';
  webmSource.type = 'video/webm';
  video.appendChild(webmSource);

  const mp4Source = document.createElement('source');
  mp4Source.src = './video/flower.mp4';
  mp4Source.type = 'video/mp4';
  video.appendChild(mp4Source);

  video.addEventListener("canplaythrough", () => {
    document.getElementById("video-metadata").textContent =
        `Current src: ${video.currentSrc}, duration: ${video.duration}, w: ${video.videoWidth}, h: ${video.videoHeight}`;

    video.play();
  });

  document.getElementById("video-container").appendChild(video);

});


document.getElementById('audio').addEventListener('click', () => {
  const audio = document.createElement('audio');
  audio.controls = true;

  audio.addEventListener("canplaythrough", () => {
    document.getElementById("audio-metadata").textContent =
        `Current src: ${audio.currentSrc}, duration: ${audio.duration}`;

    audio.play();
  });

  audio.src = './audio/t-rex-roar.mp3'

  document.getElementById("audio-container").appendChild(audio);

});
