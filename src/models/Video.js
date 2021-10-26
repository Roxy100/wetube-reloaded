import mongoose from "mongoose";

// 데이터가 어떤 형태로 구성되는 형식을 정의함.
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

// model를 만들고 export 해줘야 함.
const Video = mongoose.model("Video", videoSchema);
export default Video;
