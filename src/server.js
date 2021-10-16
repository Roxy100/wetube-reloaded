// "express"라는 package를 express라는 이름으로 import해온 것.
import express from "express";
// morgan은 GET, path, status code ... 모든 정보를 가지고 있음.
import morgan from "morgan";

// My first SERVER localhost:4000
const PORT = 4000;
// express application을 만들 것임.
const app = express();
// morgan을 middleware로 사용한 것.
// dev는 옵션 중 하나.
const logger = morgan("dev");

const home = (req, res) => {
  console.log("I will respond.");
  return res.send("hello");
};
const login = (req, res) => {
  return res.send("login");
};
// logger함수는 middleware를 return해줌.
app.use(logger);
app.get("/", home);
app.get("/login", login);

// 그 서버가 port 4000을 listening하고 있음.
const handleListening = () =>
  console.log("✅ Server listening on port http://localhost:${PORT} 🚀");

app.listen(PORT, handleListening);
