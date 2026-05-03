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
propertyRouter.get(
  "/get-single-property/:propertyId",
  authorise,
  getPropertyById,
);
propertyRouter.patch("/update-property", authorise, updateProperty);
propertyRouter.get("/get-user-properties/:userId", getUserProperties);
propertyRouter.delete(
  "/delete-property/:propertyId",
  authorise,
  deleteProperty,
);

export default propertyRouter;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWY3YmI5OGU4YzA1MzQyMWIxNzAzODciLCJpYXQiOjE3Nzc4NDMxMzYsImV4cCI6MTc3NzkyOTUzNn0.314hcEOglXIoJLizhu-_hZdbalmzbJ1vGLS5phWCI8I
