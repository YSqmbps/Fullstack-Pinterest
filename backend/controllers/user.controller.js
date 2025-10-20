import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "所有字段都是必填项",
    });
  }

  const newHashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    hashedPassword: newHashedPassword,
  });

  const { hashedPassword, ...detailWithoutPassword } = user.toObject();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  res.status(201).json({ detailWithoutPassword });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "所有字段都是必填项",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "邮箱或密码错误",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "密码错误",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  const { hashedPassword, ...detailWithoutPassword } = user.toObject();
  res.status(200).json({ detailWithoutPassword });
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "用户已退出登录" });
};

export const getUser = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  const { hashedPassword, ...detailWithoutPassword } = user.toObject();

  res.status(200).json(detailWithoutPassword);
};
