// "express"라는 package를 express라는 이름으로 import해온 것.
import express from "express";

// My first SERVER localhost:4000
const PORT = 4000;
// express application을 만들 것임.
const app = express();

// middleware(request와 response와 중간사이위치하는 software)만들기
// middleware는 작업을 다음함수[next()]에게 넘기는 함수임.
// middleware는 next함수 argument 하나가 추가된다는 점민 빼면, 그냥 일반적인 controller랑 같은 것.
const logger = (req, res, next) => {
  console.log("${req.method} ${req.url}");
  next();
};

const handleHome = (req, res) => {
  return res.send("I love middlewares.");
};
// app.use는 global middleware를 만들 수 있게 해준다. 즉, 어느 URL에도 작동하는 middleware!
// 순서 --> middleware를 use하는 게 먼저오고, 그 다음에 URL의 get이 와야 함!!!!
app.get("/", logger, handleHome);

// 그 서버가 port 4000을 listening하고 있음.
const handleListening = () =>
  console.log("✅ Server listening on port http://localhost:${PORT} 🚀");

app.listen(PORT, handleListening);
