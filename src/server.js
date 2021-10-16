// "express"라는 package를 express라는 이름으로 import해온 것.
import express from "express";

// My first SERVER localhost:4000
const PORT = 4000;
// express application을 만들 것임.
const app = express();

// middleware(request와 response와 중간사이위치하는 software)만들기
// middleware는 작업을 다음함수[next()]에게 넘기는 함수임.
// user가 웹사이트 어디로 가려는지 알려주는 gossipMiddleware가 생긴 것.
const gossipMiddleware = (req, res, next) => {
  console.log("Someone is going to: ${req.url}");
  next();
};
const handleHome = (req, res) => {
  return res.send("I love middlewares.");
};
app.get("/", gossipMiddleware, handleHome);

// 그 서버가 port 4000을 listening하고 있음.
const handleListening = () =>
  console.log("✅ Server listening on port http://localhost:${PORT} 🚀");

app.listen(PORT, handleListening);
