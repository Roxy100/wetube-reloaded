const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value; // 사용자가 내용을 적고,
  const videoId = videoContainer.dataset.id; // 어떤 비디오에 댓글을 달지 알아야 해서.
  // textarea가 비어있으면 request를 보내지 않도록.
  if (textarea === "") {
    return;
  }
  // fetch는 JS를 통해서 request를 보낼 수 있게 만들어준다. URL 변경 없이!
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // (1) Express에게 string을 보내고 있는 것 같지만, 사실 Json string을 보내고 있는 거야!
    },
    body: JSON.stringify({ text }), // (1) Javascript object를 받아서, string으로 바꿔서 보낼 수 있도록 하고,
  });
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
