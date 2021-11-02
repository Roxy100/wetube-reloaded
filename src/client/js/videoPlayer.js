const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

// 1.(2) global controlsTimeout이 null -> numbers로 바꿔줌.
let controlsTimeout = null;
// 2.(2) global controlsMovementTimeout이 null -> number로 바꿔줌. (timeout의 id)
let controlsMovementTimeout = null;

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
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

// <Mute, Unnute>
const handleMute = (e) => {
  if (video.muted) {
    video.muted = false; // 음소거 해제
  } else {
    video.muted = true; // 음소거 상태중~
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : globalVolumeValue;
};

// <Volume>
const handleVolumeChange = (event) => {
  // input이벤트가 일어날 때 지정한 값을 불러올 수 있게.
  // event.target.value의 value 속성은 string!
  const {
    target: { value: globalVolumeValue },
  } = event;
  // 음소거를 해제한다면, 그 전의 볼륨 상태로 돌아가게끔 해주고 싶을 때,
  //  globalVolumeValue이라는 global variable을 업데이트 해줄 것.
  globalVolumeValue === "0"
    ? ((video.muted = true), (muteBtnIcon.classList = "fas fa-volume-mute"))
    : ((video.muted = false), (muteBtnIcon.classList = "fas fa-volume-up"));
  // 비디오의 볼륨을 바뀌게 하는 것.
  // video.volume 속성은 number!
  video.volume = value;
};

// <Time Formatting>
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

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

// <Full Screen Btn>
const handleFullScreen = () => {
  // fullscreenElement가 null을 반환한다면 풀스크린인 element가 없다는 뜻. (풀스크린 모드가 아니라는 것!)
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    // fullscreen 모드를 종료하고 싶을 때,
    document.exitFullscreen(); // exitFullscreen은 document에서 불려져야 한다는 것!
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    // fullscreen 모드로 하고 싶을 때,
    videoContainer.requestFullscreen(); // requestFullscreen은 element에서 불러져야 한다는 것!
    fullScreenIcon.classList = "fas fa-compress";
  }
};

// <Controls Events>
// 컨트롤을 숨겨주는 것!
const hideControls = () => videoControls.classList.remove("showing");

// MouseMove
const handleMouseMove = () => {
  // 1. User(마우스)가 video에 들어왔다 떠나서 다시 들어올 때 발생하는 것!
  if (controlsTimeout) {
    // 1.(3) 떠나다가 video안에 오게 되면, controlsTimeout이 number가 돼서 Timeout을 취소할 수 있게 되는 것!
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  // 2. User(마우스)가 video안에 있을 때,
  if (controlsMovementTimeout) {
    // 2.(1) 마우스를 움직일 때, mousestop할 수 있는 clearTimeout도 같이 시작하게 됨.
    clearTimeout(controlsMovementTimeout);
    // 2.(3) 오래된 timeout은 취소되고,
    controlsMovementTimeout = null;
  }
  // 컨트롤을 보여주는 것!
  videoControls.classList.add("showing");
  // 2.(1) video안에서 마우스가 움직이기 시작하면 Timeout을 시작한 후부터 3초 뒤에 컨트롤을 숨긴다.
  // 2.(4) 마우스를 움직이지 않아도 컨트롤 부분이 숨겨지는 경우, 새로운 Timeout을 생성하게 된다!
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

// Mouseleave
// 1.(1) User(마우스커서)가 video로부터 떠나면, hideControls가 3초 뒤에 실행이 된다! setTimeout이 되서,
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
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
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

// video.readyState가 4 : video가 충분히 불러와져서 사용이 가능하다는 뜻.
if (video.readyState == 4) {
  handleLoadedMetadata();
}
