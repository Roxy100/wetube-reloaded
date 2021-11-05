const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value; // 사용자가 내용을 적고,
  const videoId = videoContainer.dataset.id; // 어떤 비디오에 댓글을 달지 알아야 해서.
  // text가 비어있으면 request를 보내지 않도록.
  if (text === "") {
    return;
  }
  // fetch는 JS를 통해서 request를 보낼 수 있게 만들어준다. URL 변경 없이!
  // fetch는 DB랑 연동되는 시간이 있어서 await해줘야 한다!
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // (1) Express에게 string을 보내고 있는 것 같지만, 사실 Json string을 보내고 있는 거야!
    },
    body: JSON.stringify({ text }), // (1) Javascript object를 받아서, string으로 바꿔서 보낼 수 있도록 하고,
  });
  textarea.value = "";
  if (status === 201) {
    addComment(text);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
