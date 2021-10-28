// "express"라는 package를 express라는 이름으로 import해온 것.
import express from "express";
// morgan은 GET, path, status code ... 모든 정보를 가지고 있음.
import morgan from "morgan";
// session은 세션 등을 말하는 것.
import session from "express-session";
// 따로 독립되어있는 export한 라우터들을 모아 import한 것들.
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

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

// session middleware
// express가 세션을 메모리에 저장하고 있다. 그러나, 서버 재시작되면, 세션을 잊어버리게 된다.
app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});

// 이 URL을 /add-one이라고 한다면,
app.get("/add-one", (req, res, next) => {
  // 어떤 정보를 Javascript object에 넣어보자. 세션 object안에 potato를 만들어보았다.
  req.session.potato += 1;
  return res.send(`${req.session.id}\n${req.session.potato}`);
});

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
