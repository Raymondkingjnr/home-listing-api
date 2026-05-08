import { Router } from "express";
import authorise from "../middlewares/auth.middleware.js";
import {
  deleteComment,
  getPropertyComments,
  postComment,
} from "../controllers/comments.controllers.js";

const commentRouter = Router();

commentRouter.post("/post-comment/:propertyId", authorise, postComment);
commentRouter.get("/get-property-comments/:propertyId", getPropertyComments);
commentRouter.delete("/delete-comment/:commentId", authorise, deleteComment);

export default commentRouter;
