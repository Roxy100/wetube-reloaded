const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value; // 사용자가 내용을 적고,
  const videoId = videoContainer.dataset.id; // 어떤 비디오에 댓글을 달지 알아야 해서.
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}
