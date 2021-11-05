import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  // User가 댓글을 달면, User는 Owner가 되는 것! 즉, 댓글 1개 = 1 User
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  // User가 비디오에 댓글을 달기 때문에, 즉, 댓글이 video부분을 갖는다는 것!
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
