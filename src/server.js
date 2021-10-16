// "express"라는 package를 express라는 이름으로 import해온 것.
import express from "express";

// My first SERVER localhost:4000
const PORT = 4000;
// express application을 만들 것임.
const app = express();

// 그 서버가 port 4000을 listening하고 있음.
const handleListening = () =>
  console.log("Server listening on port http://localhost:${PORT} 🚀");

app.listen(PORT, handleListening);
