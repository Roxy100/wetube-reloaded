import mongoose from "mongoose";

// 데이터가 어떤 형태로 구성되는 형식을 정의함.
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 40 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
  },
  // Mongoose에게 type을 만들어, 'owner'가 어떤 model의 objectId라고 알려줄 것이다.
  // owner 겸 'objectId'가 'model user'에서 온다고 알려주는 것. (User.js에서 schema한 코드에서 볼 수 있다.)
  // 즉, Video Model에 objectId type을 가진 owner를 추가하고, 보내는 id는 User model에서 가져온 것이다. (owner랑 id랑 연결하려고)
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

// static function 이용한 hashtag 깔끔하게 정리하기
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

// model를 만들고 export 해줘야 함.
const Video = mongoose.model("Video", videoSchema);
export default Video;
