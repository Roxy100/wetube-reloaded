import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  // User는 많은 댓글들을 달 수 있기 때문에 comments array를 갖는 것!
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  // video는 하나의 owner를 가지고 owner는 여러 videos를 가질 수 있기 때문에,
  // video는 하나의 User를 가지지만, User는 여러 videos를 가질 수 있다.
  // 'videos'는 Video model에 연결된 ObjectId로 구성된 array.
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

// 비밀번호를 보내고 저장하면,
// 비밀번호를 수정할 때만 hash해 주는 조건으로 바꾼다.
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
