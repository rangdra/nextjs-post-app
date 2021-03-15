import connectDB from "utils/connectDB";
import Users from "models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import initMiddleware from "lib/init-middleware";
import validateMiddleware from "lib/validate-middleware";
import { check, validationResult } from "express-validator";

connectDB();

const validateBody = initMiddleware(
  validateMiddleware(
    [
      check("username", "Username atau Email tidak boleh kosong").notEmpty(),
      check("password")
        .notEmpty()
        .withMessage("Password tidak boleh kosong")
        .isLength({ min: 6 })
        .withMessage("Password minimal 6 karakter")
        .matches(/\d/)
        .withMessage("Password harus memiliki angka"),
    ],
    validationResult
  )
);
export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await validateBody(req, res);

      await login(req, res);
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." });
      break;
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Username atau email tidak terdaftar.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        status: "error",
        message: "Password salah, silahkan coba lagi!",
      });

    const token = generateToken({ id: user._id });
    res.json({
      status: "success",
      message: "Login Success!",
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};
