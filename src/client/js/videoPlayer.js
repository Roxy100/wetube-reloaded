const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

// 비디오를 멈추고 플레이 하는 function.
const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};
// 텍스트를 바꿔주는 function.
const handlePause = () => (playBtn.innerText = "Play");
const handlePlay = () => (playBtn.innerText = "Pause");

const handleMute = (e) => {};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
