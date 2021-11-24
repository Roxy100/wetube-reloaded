import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
import { async } from "regenerator-runtime";

// <Home>
export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
}; // home.pug를 렌더링한다.

// <Watch Video>
export const watch = async (req, res) => {
  // const id = req.params.id;
  const { id } = req.params;
  // populate("owner")하기 않으면, 그냥 owner의 string값만 볼 수 있지만,
  // populate("owner")하면, owner의 모든 정보들(object)을 다 볼 수 있게 된다. 특히, 사용자의 이름을 받고 싶어서.
  // populate("comments")하면, 모든 댓글들(comments)의 모든 정보들을 다 볼 수 있게 된다. 특히, 비디오의 댓글을 받고 싶어서.
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("videos/watch", { pageTitle: video.title, video });
}; // watch.pug를 렌더링한다.

// <Update Video>
// 유저가 getEdit로 올 때, 우린 편집용 form을 render해줄 거고,
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  // video.owner는 object형태이고, _id는 string형태라서, String()로 바꿔준다.
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", {
    pageTitle: `Edit: ${video.title}`,
    video,
  });
}; // edit.pug를 렌더링한다.

// 유저가 submit하면, 우리의 post request로 이동해서 postEdit가 처리해준다.
// postEdit은 route로부터 id를 얻어와서 /videos/id 페이지로 redirect해준다.
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  // video.owner는 object형태이고, _id는 string형태라서, String()로 바꿔준다.
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
}; // req.body 는 form에 있는 value의 javascript representation임. (javascript식으로 표현한 것.) ex.edit.pug의 form식.
// req.body를 나타내주려면 form의 name을 반드시 넣어주어야 한다!!!
// res.redirect 는 브라우저가 자동으로 이동하도록 하는 기능.

// <Upload Video>
export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload Video" });
};

// postUpload라는 function이 호출이 될 것임.
export const postUpload = async (req, res) => {
  // 영상을 업로드 할 때 업로드하는 사용자의 'id'를 전송해야하기 때문에.
  const {
    user: { _id },
  } = req.session;
  // 'multer'는 'req.file 뿐만 아니라 'req.files'도 제공해주는데, 'path'를 'req.files.path에서 받은 뒤, 그 이름을 'video.path, thumb.path'로 지정한다.
  const { video, thumb } = req.files;
  // req.body로부터 그 name(title, description, hashtags)로 데이터를 받을 수 있을 것임.
  const { title, description, hashtags } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";
  // 데이터를 검증할 수 있는 js object의 간단한 코드.(js object를 만들고 db에 save하는 저장 코드 대신)
  try {
    // newVideo의 id를 User의 'videos array'에 추가해 줄 것이기 때문에,
    // 새로 업로드 될 영상의 _id를 'User model'에도 저장해줘야 한다.
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : video[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id); // 'array'에 요소를 추가할 때는 push를 사용할 것!
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

// <Delete Video>
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  // video.owner는 object형태이고, _id는 string형태라서, String()로 바꿔준다.
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
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
        $regex: new RegExp(keyword, "i"), // i는 대문자와 소문자를 구분하지 않는다는 뜻.
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

// <Register View 조회수 기록하기>
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  // update the video
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

// <Comment 작성하면, 보내기>
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  // Update the Id of the newly created comment to the video
  video.comments.push(comment._id);
  video.save();
  // (1) backend에서 상태 코드를 201로 보낼 뿐만 아니라. frontend에게 새로 생긴 댓글의 id를 보내기 위해서.
  // 사용자가 새로 생성한 댓글을 바로 지울 수 있도록 하기 위함!!! (웹페이지를 새로고침 하지 않고!)
  // 어떤 json object를 보내주고 있다. 그 이름은 newCommentId이고, 그 값은 새로 만들어진 댓글의 id이다.
  return res.status(201).json({ newCommentId: comment._id });
};

// <Comment 버튼 X를 이용하여 삭제하기>
export const deleteComment = async (req, res) => {
  const {
    session: { user },
    params: { id: commentId },
  } = req;
  const comment = await Comment.findById(commentId)
    .populate("video")
    .populate("owner");
  if (!comment) {
    return res.sendStatus(404);
  }
  if (String(user._id) !== String(comment.owner.id)) {
    return res.status(403).redirect("/");
  }
  await Comment.findByIdAndDelete(commentId);
  return res.status("200").redirect(`/videos/${comment.video._id}`);
};
