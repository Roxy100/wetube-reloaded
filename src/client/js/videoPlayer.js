const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

// globalVolumeValue이 바뀔 때마다 매번 업데이트 해 줄 것!
// 이 때의 globalVolumeValue변수는 string!
let globalVolumeValue = 0.5;
video.volume = globalVolumeValue;

// <Play, Pause>
const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

// <Mute, Unnute>
const handleMute = (e) => {
  if (video.muted) {
    video.muted = false; // 음소거 해제
  } else {
    video.muted = true; // 음소거 상태중~
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

// <Volume>
const handleVolumeChange = (event) => {
  // input이벤트가 일어날 때 지정한 값을 불러올 수 있게.
  // event.target.value의 value 속성은 string!
  const {
    target: { value },
  } = event;
  // 음소거를 해제한다면, 그 전의 볼륨 상태로 돌아가게끔 해주고 싶을 때,
  //  globalVolumeValue이라는 global variable을 업데이트 해줄 것.
  globalVolumeValue === "0"
    ? ((video.muted = true), (muteBtn.innerText = "Unmute"))
    : ((video.muted = false), (muteBtn.innerText = "Mute"));
  // 비디오의 볼륨을 바뀌게 하는 것.
  // video.volume 속성은 number!
  video.volume = value;
};

// <Time Formatting>
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

// <Duration> - 비디오가 로드될 때마다 길이를 알 수 있는 함수.
const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration)); // 텍스트 변화
  timeline.max = Math.floor(video.duration); // range의 max value 변화
};
// <CurrentTime> - 현재시간이 변할 때마다 업데이트하는 함수.
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime)); // 텍스트 변화
  timeline.value = Math.floor(video.currentTime); // range의 value 변화
};

// <Timeline>
const handleTimelineChange = (event) => {
  // input이벤트가 일어날 때 지정한 값을 불러올 수 있게.
  const {
    target: { value },
  } = event;
  // video가 진행하는 시간이 value값과 일치하게끔.
  video.currentTime = value;
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
// input을 이용해서 실시간으로 비디오 볼륨을 세팅할 수 있다는 것!
volumeRange.addEventListener("input", handleVolumeChange);
// 비디오의 재생시간이 로드되었을 때!
video.addEventListener("loadedmetadata", handleLoadedMetadata);
// 비디오의 현재시간이 변할 때마다 발생됨!
video.addEventListener("timeupdate", handleTimeUpdate);
// input을 이용해서 실시간으로 타임라인을 세팅하고 움직일 수 있는 것!
timeline.addEventListener("input", handleTimelineChange);

// video.readyState가 4 : video가 충분히 불러와져서 사용이 가능하다는 뜻.
if (video.readyState == 4) {
  handleLoadedMetadata();
}
