import Users from "models/userModel";
import auth from "middleware/auth";
import connectDB from "utils/connectDB";
import bcrypt from "bcryptjs";
import initMiddleware from "lib/init-middleware";
import validateMiddleware from "lib/validate-middleware";
import { check, validationResult } from "express-validator";

connectDB();

const validateBody = initMiddleware(
  validateMiddleware(
    [
      check("fullname", "Full name tidak boleh kosong").notEmpty(),
      check("username", "User name tidak boleh kosong").notEmpty(),
      check("email")
        .notEmpty()
        .withMessage("Email tidak boleh kosong")
        .isEmail()
        .withMessage("Invalid email"),
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
    case "GET":
      await getUserById(req, res);
      break;
    case "PUT":
      await validateBody(req, res);
      await updateUser(req, res);
      break;
    case "DELETE":
      await deleteUser(req, res);
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." });
      break;
  }
};

const getUserById = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    const userById = await Users.findById(id).select(
      "_id role fullname username email "
    );

    return res.json({
      status: "success",
      message: "Success mengambil detail user by id | admin only",
      data: userById,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    await Users.findByIdAndDelete(id);

    return res.json({
      status: "success",
      message: "Success delete user | admin only.",
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (!result)
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { fullname, username, email, password, avatar } = req.body;

    // const emailExist = await Users.findOne({ email });
    // if (emailExist)
    //   return res.status(400).json({ err: "Email already exist." });

    // const usernameExist = await Users.findOne({ username });
    // if (usernameExist)
    //   return res.status(400).json({ err: "Username already exist." });

    const user = await Users.findById(id);

    const passwordHash = await bcrypt.hash(password, 12);
    if (user) {
      user.fullname = fullname || user.fullname;
      user.username = username || user.username;
      user.email = email || user.email;
      user.password = passwordHash;
      user.avatar = avatar || user.avatar;

      user.save();

      return res.json({
        status: "success",
        message: "Success update user",
        data: {
          _id: user._id,
          avatar: user.avatar,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
