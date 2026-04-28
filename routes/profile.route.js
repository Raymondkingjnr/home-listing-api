import { Router } from "express";
import {
  getAllProfiles,
  getUserProfile,
  updateUserProfile,
} from "../controllers/profile.controllers.js";
import authorise from "../middlewares/auth.middleware.js";

const profileRouter = Router();

profileRouter.get("/get-user", authorise, getUserProfile);
profileRouter.get("/user/:userId", authorise, getUserProfile);
profileRouter.get("/get-all-profiles", getAllProfiles);
profileRouter.patch("/update-user", authorise, updateUserProfile);

export default profileRouter;
