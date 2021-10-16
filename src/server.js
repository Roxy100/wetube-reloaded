// "express"라는 package를 express라는 이름으로 import해온 것.
import express from "express";

// My first SERVER localhost:4000
const PORT = 4000;
// express application을 만들 것임.
const app = express();

// GET Request 완료하기
// 브라우저가 나의 서버에 무언가를 request(요청)한다.
// GET / -> 웹사이트를 가져와달라는 rquest.
const handleHome = () => console.log("Somebody is trying to go home.");

app.get("/", handleHome);

// 그 서버가 port 4000을 listening하고 있음.
const handleListening = () =>
  console.log("Server listening on port http://localhost:${PORT} 🚀");

app.listen(PORT, handleListening);
