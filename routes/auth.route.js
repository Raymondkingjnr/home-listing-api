import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  creatNewPassword,
  changePassword,
} from "../controllers/auth.controllers.js";
import authorise from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.put("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/createNewPassword", creatNewPassword);
authRouter.patch("/changePassword", authorise, changePassword);

export default authRouter;
