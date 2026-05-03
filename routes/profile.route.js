import { Router } from "express";
import {
  getAllProfiles,
  getUserProfile,
  updateUserProfile,
} from "../controllers/profile.controllers.js";
import authorise from "../middlewares/auth.middleware.js";

const profileRouter = Router();

profileRouter.get("/get-user", authorise, getUserProfile);
profileRouter.get("/user/:userId", getUserProfile);
profileRouter.get("/get-all-profiles", getAllProfiles);
profileRouter.patch("/update-user/:userId", authorise, updateUserProfile);

export default profileRouter;
