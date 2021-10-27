import Video from "../models/Video";

// <Home>
export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", videos });
}; // home.pug를 렌더링한다.

// <Watch Video>
export const watch = async (req, res) => {
  // const id = req.params.id;
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
}; // watch.pug를 렌더링한다.

// <Update Video>
// 유저가 getEdit로 올 때, 우린 편집용 form을 render해줄 거고,
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
}; // edit.pug를 렌더링한다.

// 유저가 submit하면, 우리의 post request로 이동해서 postEdit가 처리해준다.
// postEdit은 route로부터 id를 얻어와서 /videos/id 페이지로 redirect해준다.
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
}; // req.body 는 form에 있는 value의 javascript representation임. (javascript식으로 표현한 것.) ex.edit.pug의 form식.
// req.body를 나타내주려면 form의 name을 반드시 넣어주어야 한다!!!
// res.redirect 는 브라우저가 자동으로 이동하도록 하는 기능.

// <Upload Video>
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
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

// <Delete Video>
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

// <Search>
export const search = async (req, res) => {
  const { keyword } = req.query;
  // 포괄적으로 다 포함하는 let videos array가 필요한 것.
  // keyword가 있던 없던 videos는 empty array이다.
  // keyword가 있다면 videos array는 업데이트 될 것.
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"), // i는 대문자와 소문자를 구분하지 않는다는 뜻.
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
