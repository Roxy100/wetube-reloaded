// "express"라는 package를 express라는 이름으로 import해온 것.
import express from "express";

// My first SERVER localhost:4000
const PORT = 4000;
// express application을 만들 것임.
const app = express();

// GET Response해주기
// request object, response object라는 2개의 argument가 있어야 함.
const handleHome = (req, res) => {
  return res.send("I still love you.");
};
const handleLogin = (req, res) => {
  return res.send("Login here.");
};
app.get("/", handleHome);
app.get("/login", handleLogin);

// 그 서버가 port 4000을 listening하고 있음.
const handleListening = () =>
  console.log("✅ Server listenting on port http://localhost:${PORT} 🚀");

app.listen(PORT, handleListening);
