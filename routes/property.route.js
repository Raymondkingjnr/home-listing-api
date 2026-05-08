import { Router } from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  getUserProperties,
  deleteProperty,
} from "../controllers/property.controllers.js";
import authorise from "../middlewares/auth.middleware.js";

const propertyRouter = Router();

propertyRouter.get("/get-all-properties", getAllProperties);
propertyRouter.post("/create-property/", authorise, createProperty);
propertyRouter.get("/get-single-property/:propertyId", getPropertyById);
propertyRouter.patch("/update-property", authorise, updateProperty);
propertyRouter.get(
  "/get-user-properties/:userId",
  authorise,
  getUserProperties,
);
propertyRouter.delete(
  "/delete-property/:propertyId",
  authorise,
  deleteProperty,
);

export default propertyRouter;
