import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { async } from "regenerator-runtime";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

// 함수는 기본적으로 비어있는 stream, recorder, videoFile이라는 let 변수 형성.
let stream;
let recorder;
let videoFile;

// <녹화파일 다운로드하기>
// 5. 그 뒤, handleDownload 실행한다.
const handleDownload = async () => {
  // Step 1. ffmpeg(가상컴퓨터) 소프트웨어 사용
  // createFFmpegCore is not defined at HTMLScriptElement.eventHandler (getCreateFFmpegCore.js:101)) 에러 해결!
  const ffmpeg = createFFmpeg({
    corePath: "/convert/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  // Step 2. ffmpeg(가상컴퓨터)에 파일을 만들기
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  // Step 3. (1) ffmpeg(가상컴퓨터)에 이미 존재하는 파일을 input으로 받기
  // Step 3. (2) 초당 60프레임으로 인코딩해서 output.mp4로 변환해주기
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  // 5.(3) a 링크 형성.
  const a = document.createElement("a");
  // 링크는 비디오 파일로 갈 수 있는 URL과 연결.
  a.href = videoFile;
  //a태그에 download라는 속성을 추가해주면,
  //해당 파일을 "MyRecording"이라는 파일로 저장할 수 있게 해줌.
  //URl의 콘텐츠를 다운로드 할 수 있게 해줌.
  a.download = "MyRecording.webm"; //.webm이라는 파일의 포맷을 지정.
  // 그 링크를 document.body에 추가.
  document.body.appendChild(a);
  // 사용자 대신 해당 링크를 클릭해주었음.
  a.click();
};

// <녹화 멈추기>
// 4. 그 뒤, handleStop 실행한다.
const handleStop = () => {
  // 4.(3)
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload); //5.(1) 실행
  recorder.stop(); // 4.(1) 녹화 종료
};

// <녹화를 진행하기>
// 3. handleStart가 먼저 실행하고,
const handleStart = () => {
  // 3.(1) Step 1. 버튼클릭하면 실행되는 것들.
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop); // 4.(1) 실행.
  // Step 2.녹화할 수 있게 만들기
  // 3.(2) 받아오는 stream으로 new MediaRecorder를 생성해주고,
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  // 4.(2), 5.(2) 녹화 종료 후 발생되는 ondataavailable event
  recorder.ondataavailable = (event) => {
    // createObjectUrl : 브라우저가 파일을 보여주는 방법일 뿐. (그 파일을 미리보고 싶을 때)
    // createObjectUrl()을 매번 호출할 때마다 새로운 객체 URL을 생성함.
    // 브라우저의 메모리 상에 파일을 저장해두고 브라우저가 그 파일에 접근할 수 있는 URL을 준 것.
    // event.data라는 마법의 URL인 파일을 공유하고자.
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null; // video에 비디오 preview를 제거.
    video.src = videoFile; // 마법의 URl인 파일을 src로 추가.
    video.loop = true; // 반복적으로 재생하게.
    video.play();
  };
  recorder.start(); // 3.(3) 녹화 시작
};

// 1. init 함수 실행됨.
const init = async () => {
  // stream : 실시간으로 재생되는 데이터
  // mediaDevices는 마이크, 카메라와 같은 미디어 장비들에 접근하게 함.
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false, // 오디오는 실행 X
    video: true, // 비디오는 실행 O
  }); // 사용자에게 미디어 입력 장치 사용 권한을 요청.
  // srcobject에 stream을 추가하고 video를 실행한다.
  // srcObject란? --> video에 주는 무언가를 의미함. Html Url의 src와는 다름.
  video.srcObject = stream;
  video.play();
};

init();

// 2. startBtn을 누르면,
startBtn.addEventListener("click", handleStart);
