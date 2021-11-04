import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { async } from "regenerator-runtime";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

// 함수는 기본적으로 비어있는 stream, recorder, videoFile이라는 let 변수 형성.
let stream;
let recorder;
let videoFile;

// input파일과 output파일, 썸네일파일 포맷 정의
const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

// Step 7.(2) 다운로드파일을 가지고 마법의 Url형성.
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a"); // a 링크 형성.
  a.href = fileUrl; // 링크의 href는 영상/썸네일을 담고 있는 마법의 url
  //a태그에 download라는 속성을 추가해주면,
  //해당 파일을 "MyRecording"이라는 파일로 저장할 수 있게 해줌.
  //URl의 콘텐츠를 다운로드 할 수 있게 해줌.
  a.download = fileName; //.mp4/.jpg이라는 파일의 포맷을 지정.
  document.body.appendChild(a); // 그 링크를 document.body에 추가.
  a.click(); // 사용자 대신 해당 링크를 클릭해주었음.
};

// <녹화파일 다운로드하기>
// 5. 그 뒤, handleDownload 실행한다.
const handleDownload = async () => {
  // Step 0. actionBtn 클릭하면, handleDownload함수 작동한 뒤, 클릭이벤트 제거.
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  // Step 1. ffmpeg(가상컴퓨터) 소프트웨어 사용
  // createFFmpegCore is not defined at HTMLScriptElement.eventHandler (getCreateFFmpegCore.js:101)) 에러 해결!
  const ffmpeg = createFFmpeg({
    corePath: "/convert/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();

  // Step 2. ffmpeg(가상컴퓨터)에 파일을 만들기
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  // Step 3. (1) ffmpeg(가상컴퓨터)에 이미 존재하는 파일을 input으로 받기
  // Step 3. (2) 초당 60프레임으로 인코딩해서 output.mp4로 변환해주기
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  // Step 3. (3) 썸네일 만들기
  await ffmpeg.run(
    "-i", // 인풋
    files.input,
    "-ss", // 영상의 시간대
    "00:00:01",
    "-frames:v", // 스크린샷
    "1",
    files.thumb // 결과물
  );

  // Step 4. mp4파일, 썸네일파일 읽어오기
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  // Step 5. 자바스크립트에서 파일같은 객체를 만들려면,
  // 이상하게 생긴 data(Blob)를 받아서, blob에 binary data로 각각 mp4파일과 썸네일파일을 줘야 함.
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  // Step 6. blob(파일)을 가지고 mp4, 썸네일의 objectURl을 만듬.
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  // Step 7. mp4, jpg를 다운 받기 위한 Url형성.
  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  // Step 8. 이 파일들을 메모리에서 삭제하기 위해 unlink했음.
  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  // 마법의 URL 삭제
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(videoFile);

  // Step 9. 변환이 끝나면,...
  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart); // 다시 3.handleStart가 실행되도록
};

// <녹화를 진행하기>
// 3. handleStart가 먼저 실행하고,
const handleStart = () => {
  // 3.(1) Step 1. 버튼클릭하면 실행되는 것들.
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
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
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload); // 5. handleDownload 실행
  };
  recorder.start(); // 3.(3) 녹화 시작
  setTimeout(() => {
    recorder.stop();
  }, 5000); // 5초 동안 녹화 후 Stop <-handleStop 함수 대신
};

// 1. init 함수 실행됨.
const init = async () => {
  // stream : 실시간으로 재생되는 데이터
  // mediaDevices는 마이크, 카메라와 같은 미디어 장비들에 접근하게 함.
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false, // 오디오는 실행 X
    video: {
      width: 1024,
      height: 576,
    },
  }); // 사용자에게 미디어 입력 장치 사용 권한을 요청.
  // srcobject에 stream을 추가하고 video를 실행한다.
  // srcObject란? --> video에 주는 무언가를 의미함. Html Url의 src와는 다름.
  video.srcObject = stream;
  video.play();
};

init();

// 2. actionBtn을 누르면,
actionBtn.addEventListener("click", handleStart);
