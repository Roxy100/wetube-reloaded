// "express"라는 package를 express라는 이름으로 import해온 것.
import express from "express";
// morgan은 GET, path, status code ... 모든 정보를 가지고 있음.
import morgan from "morgan";
// 따로 독립되어있는 export한 라우터들을 모아 import한 것들.
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log("✅ Server listening on port http://localhost:${PORT} 🚀");

app.listen(PORT, handleListening);
