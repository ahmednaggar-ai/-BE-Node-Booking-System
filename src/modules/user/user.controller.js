import { UserModel } from "../../database/models/user.model.js";
import { errorResponse } from "../../common/responses/error.response.js";
import bcrypt from "bcrypt";
import { successResponse } from "../../common/responses/success.response.js";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env.service.js";

const registerUser = async (req, res, next) => {
  try {
    let { fullName, email, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    let user = await UserModel.findOne({ email });
    if (user) {
      return errorResponse(res, 400, "User already exists", null);
    }
    user = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
    });
    return successResponse(res, 201, "User created successfully", user);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "User not found", null);
    }
    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return errorResponse(res, 400, "Invalid password", null);
    }
    let token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return successResponse(res, 200, "Login successful", { token });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) {
      return errorResponse(res, 404, "User not found", null);
    }
    return successResponse(res, 200, "User found", user);
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, getUserById };
