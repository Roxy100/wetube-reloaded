export const trending = (req, res) => {
  const videos = [
    {
      title: "First Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "Second Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "Third Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
  ];
  return res.render("home", { pageTitle: "Home", videos });
}; // home.pug를 렌더링한다.
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" }); // watch.pug를 렌더링한다.
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" }); // edit.pug를 렌더링한다.
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
  return res.send("Delete Video");
};
