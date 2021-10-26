// db를 import해서 연결시킨 후,
import "./db";
// 해당연결이 성공적일 때, video를 import해주는 것.
// db.js를 mongoose와 연결시켜서 video model를 인식시키는 것.
import "./models/Video";
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

// express는 html을 리턴하기 위해 pug를 사용할 거라고 지정함.
// console.log(process.cwd()); 해서 현재 작업 디렉토리를 확인해보자.
// 현재 작업 디렉토리는 node.js를 시작하는 디렉토리라는 것!!! 즉, 우리는 /wetube-reloaded
// "현재 작업 디렉토리" + /views" 설정해준다.
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
// express application이 form의 value들을 이해할 수 있도록 하고, form을 멋진 javascript object 형식으로 바꿔주는 middleware.
app.use(express.urlencoded({ extended: true }));
// videoRouter > videoController > postEdit에 있는 req.body와 연결되는 지점.
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log("✅ Server listening on http://localhost:${PORT} 🚀");

app.listen(PORT, handleListening);
