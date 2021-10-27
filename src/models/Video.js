import mongoose from "mongoose";

// 데이터가 어떤 형태로 구성되는 형식을 정의함.
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 40 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

// 영상을 생성하거나 업데이트 하기 전에 그 프로세스를 잠시 중단하고,
// hashtag를 처리해서 더 깔끔하게 정리를 하고, 하던 걸 마저 하는 과정.
// -> middleware은 무조건 model이 생성되기 전에 만들어야 한다.
// 코드에 대한 이해는 pre middleware를 save 이벤트에 적용시킨 것!
// 이걸 하는 이유는 hashtags가 [how,are,you] => ["for","are","you"]
videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

// model를 만들고 export 해줘야 함.
const Video = mongoose.model("Video", videoSchema);
export default Video;
