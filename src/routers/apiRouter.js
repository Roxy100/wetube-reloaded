import express from "express";
import { registerView } from "../controllers/videoController";

const apiRouter = express.Router();

// post요청을 보내면 조회수를 기록할 수 있게 만드는..
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);

export default apiRouter;
