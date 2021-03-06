import "regenerator-runtime";
// dotenv는 파일을 읽고 env에 추가를 해줄 것.
import "dotenv/config";
// db를 import해서 연결시킨 후,
import "./db";
// 해당연결이 성공적일 때, video를 import해주는 것.
// db.js를 mongoose와 연결시켜서 video model를 인식시키는 것.
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
