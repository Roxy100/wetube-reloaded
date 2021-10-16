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
const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed<h1>");
  }
  console.log("Allowed, you may continue.");
  next();
};

const handleHome = (req, res) => {
  return res.send("I love middlewares.");
};
const handleProtected = (req, res) => {
  return res.send("Welcome to the private lounge.");
};
// app.use는 global middleware를 만들 수 있게 해준다. 즉, 어느 URL에도 작동하는 middleware!
// 순서 --> middleware를 use하는 게 먼저오고, 그 다음에 URL의 get이 와야 함!!!!
// middleware를 app 전체에 어떤 url에서도 사용할 수 있도록 할 수 있고,
app.use(logger);
app.use(privateMiddleware);

app.get("/", handleHome);
app.get("/protected", handleProtected);
// middleware 하나의 url에만 사용되게 할 수 있다.
// app.use(logger);
// app.get("/", logger, handleHome);
// app.get("/protected", logger, handleProtected);

// 그 서버가 port 4000을 listening하고 있음.
const handleListening = () =>
  console.log("✅ Server listening on port http://localhost:${PORT} 🚀");

app.listen(PORT, handleListening);
