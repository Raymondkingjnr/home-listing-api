import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.modal.js";
import Profile from "../models/profile.modals.js";
import { JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_URL } from "../config/env.js";
import transporter from "../utils/sendEmail.js";
import mongoose from "mongoose";
import {
  passwordResetEmailTemplate,
  welcomeEmailTemplate,
} from "../utils/email-template.js";
import { EMAIL_USER } from "../config/env.js";

const generateVerificationToken = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";

  for (let index = 0; index < 4; index += 1) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }

  return token;
};

const welcomeEmail = async (fullname, email) => {
  const ctaUrl = `${FRONTEND_URL}/homes`;
  const message = welcomeEmailTemplate(fullname, ctaUrl);

  await transporter.sendMail({
    from: `Home Listing App <${EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Home Listing",
    html: message,
  });
};

const passwordResetEmail = async (fullname, email, token) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  const message = passwordResetEmailTemplate(fullname, resetUrl, token);

  await transporter.sendMail({
    from: `Home Listing App <${EMAIL_USER}>`,
    to: email,
    subject: "password reset",
    html: message,
  });
};
//
// const getCookieOptions = () => ({
//     httpOnly: true,
//     secure: NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
// chillrtestuser@yopmail.com
// });

export const register = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await User.create(
      [
        {
          fullname,
          email,
          password: hashedPassword,
        },
      ],
      { session },
    );

    await Profile.create(
      [
        {
          fullname,
          email,
          userId: newUser._id,
        },
      ],
      { session },
    );

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();

    // res.cookie("token", token, getCookieOptions());
    try {
      await welcomeEmail(fullname, email);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
        },
      },
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    await session.endSession();
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetPasswordToken = generateVerificationToken();
    const resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;
    await user.save();

    await passwordResetEmail(user.fullname, user.email, resetPasswordToken);

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const creatNewPassword = async (req, res, next) => {
  try {
    const { email, password, token } = req.body;
    const normalizedToken = String(token || "")
      .trim()
      .toUpperCase();

    const user = await User.findOne({
      email,
      resetPasswordToken: normalizedToken,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "current password and newPassword is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "current password is incorrect" });
    }
    const isSame = await bcrypt.compare(newPassword, user.password);

    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "new password cannot be the same as the current password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
