import Property from "../models/properties.modal.js";
import mongoose from "mongoose";

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProperty = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const userId = req.params.userId || req.user?._id;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const existing = await Property.findOne({ title: req.body.title }).session(
      session,
    );

    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Title already exists" });

    const property = await Property.create([{ user: userId, ...req.body }], {
      session,
    });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Property created",
      data: property[0],
    });
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid property ID" });
    }
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or has been removed",
      });
    }

    res.status(200).json({
      success: true,
      message: "Property fetched successfully",
      data: property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProperties = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;
    const properties = await Property.find({ user: userId });

    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const {
      body,
      query: { propertyId },
    } = req;
    const userId = req.user?._id;

    if (!userId) {
      await session.abortTransaction();
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Invalid Property ID" });
    }

    const property = await Property.findOne({
      _id: propertyId,
      user: userId,
    }).session(session);

    if (!property) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Property not found",
      });
    }

    Object.assign(property, body);
    await property.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ success: false, message: `an error occured ${error.message}` });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!propertyId) {
      return res
        .status(400)
        .json({ success: false, message: "Property Id can not be empty" });
    }

    const property = await Property.findOneAndDelete({
      _id: propertyId,
      user: userId,
    });

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
