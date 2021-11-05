import express from "express";
import { registerView, createComment } from "../controllers/videoController";

const apiRouter = express.Router();

// post요청을 보내면 조회수를 기록할 수 있게 만드는..
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
// post요청을 보내면 댓글을 보낼 수 있게 만드는...
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);

export default apiRouter;
