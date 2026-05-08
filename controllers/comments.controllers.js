import mongoose from "mongoose";
import Comment from "../models/comment.modals.js";
import Property from "../models/properties.modal.js";

export const postComment = async (req, res) => {
  try {
    const { body } = req;
    const { propertyId } = req.params;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Property ID" });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const comment = new Comment({
      content: body.content,
      owner: userId,
      property: propertyId,
    });
    await comment.save();
    property.comments.push(comment._id);
    await property.save();

    res.status(201).json({
      success: true,
      message: "Comment posted successfully",
      data: comment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `An error occurred ${error.message}` });
  }
};

export const getPropertyComments = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Property ID" });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const comments = await Comment.find({ property: propertyId })
      .select("content owner createdAt")
      .populate({
        path: "owner",
        select: "fullname",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `An error occurred ${error.message}` });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!commentId) {
      return res
        .status(404)
        .json({ success: false, message: "comment Id can not be empty" });
    }

    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      owner: userId,
    });

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    await Property.findByIdAndUpdate(comment.property, {
      $pull: { comments: comment._id },
    });

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `An error occurred ${error.message}` });
  }
};
