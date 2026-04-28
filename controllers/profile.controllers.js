import Profile from "../models/profile.modals.js";
import User from "../models/user.modal.js";
import mongoose from "mongoose";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Profiles fetched successfully",
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const userId = req.user?._id;

    if (!userId) {
      await session.abortTransaction();
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { avatar, fullname, email, gender, tele, address } = req.body;

    // Find the current profile first so we can safely update only this user's data.
    const profile = await Profile.findOne({ userId }).session(session);

    if (!profile) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Build a small update object instead of replacing the whole document.
    // This prevents fields from being overwritten with undefined values.
    const updates = {};

    if (avatar !== undefined) updates.avatar = avatar;
    if (fullname !== undefined) updates.fullname = fullname;
    if (email !== undefined) updates.email = email;
    if (gender !== undefined) updates.gender = gender;
    if (tele !== undefined) updates.tele = tele;
    if (address !== undefined) updates.address = address;

    if (Object.keys(updates).length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    // Email is unique in both User and Profile collections, so we check for conflicts.
    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: userId },
      }).session(session);

      if (existingUser) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }
    }

    // Update the profile document with the new values.
    Object.assign(profile, updates);
    await profile.save({ session });

    // Keep the User collection in sync for fields that also live there.
    const userUpdates = {};

    if (updates.fullname !== undefined) userUpdates.fullname = updates.fullname;
    if (updates.email !== undefined) userUpdates.email = updates.email;

    if (Object.keys(userUpdates).length > 0) {
      const updatedUser = await User.findById(userId).session(session);

      if (!updatedUser) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      Object.assign(updatedUser, userUpdates);
      await updatedUser.save({ session });
    }

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    res.status(500).json({ success: false, message: error.message });
  } finally {
    await session.endSession();
  }
};
