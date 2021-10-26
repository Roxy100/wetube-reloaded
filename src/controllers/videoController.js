let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
];
export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
}; // home.pug를 렌더링한다.
export const watch = (req, res) => {
  // const id = req.params.id;
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
}; // watch.pug를 렌더링한다.
// 유저가 getEdit로 올 때, 우린 편집용 form을 render해줄 거고,
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
}; // edit.pug를 렌더링한다.
// 유저가 submit하면, 우리의 post request로 이동해서 postEdit가 처리해준다.
// postEdit은 route로부터 id를 얻어와서 /videos/id 페이지로 redirect해준다.
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
}; // req.body 는 form에 있는 value의 javascript representation임. (javascript식으로 표현한 것.) ex.edit.pug의 form식.
// res.redirect 는 브라우저가 자동으로 이동하도록 하는 기능.
