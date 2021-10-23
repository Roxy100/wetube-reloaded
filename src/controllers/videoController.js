export const trending = (req, res) => {
  const videos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return res.render("home", { pageTitle: "Home", videos });
}; // home.pug를 렌더링한다.
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" }); // watch.pug를 렌더링한다.
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" }); // edit.pug를 렌더링한다.
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
  return res.send("Delete Video");
};
