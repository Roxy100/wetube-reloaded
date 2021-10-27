import Video from "../models/Video";

// Promise 식
export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
}; // home.pug를 렌더링한다.

export const watch = (req, res) => {
  // const id = req.params.id;
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watching` });
}; // watch.pug를 렌더링한다.

// 유저가 getEdit로 올 때, 우린 편집용 form을 render해줄 거고,
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
}; // edit.pug를 렌더링한다.
// 유저가 submit하면, 우리의 post request로 이동해서 postEdit가 처리해준다.
// postEdit은 route로부터 id를 얻어와서 /videos/id 페이지로 redirect해준다.
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
}; // req.body 는 form에 있는 value의 javascript representation임. (javascript식으로 표현한 것.) ex.edit.pug의 form식.
// req.body를 나타내주려면 form의 name을 반드시 넣어주어야 한다!!!
// res.redirect 는 브라우저가 자동으로 이동하도록 하는 기능.

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

// postUpload라는 function이 호출이 될 것임.
export const postUpload = async (req, res) => {
  // req.body로부터 그 name(title, description, hashtags)로 데이터를 받을 수 있을 것임.
  const { title, description, hashtags } = req.body;
  // 데이터를 검증할 수 있는 js object의 간단한 코드.(js object를 만들고 db에 save하는 저장 코드 대신)
  try {
    await Video.create({
      title,
      description,
      createdAt: Date.now(),
      hashtags: hashtags.split(",").map((word) => `${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
