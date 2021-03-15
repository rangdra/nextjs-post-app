import connectDB from "utils/connectDB";
import Users from "models/userModel";
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
      check("cf_password").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password harus sama");
        }
        return true;
      }),
    ],
    validationResult
  )
);

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await validateBody(req, res);

      await register(req, res);
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." });
      break;
  }
};

const register = async (req, res) => {
  try {
    const { fullname, username, email, password, cf_password } = req.body;

    const usernameExist = await Users.findOne({ username });
    if (usernameExist)
      return res
        .status(400)
        .json({ status: "error", message: "Username sudah tersedia." });

    const user = await Users.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ status: "error", message: "Email sudah tersedia." });

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new Users({
      fullname,
      username: usernameValidasi(username),
      email,
      password: passwordHash,
      cf_password,
    });

    await newUser.save();
    res.json({
      status: "success",
      message: "Register Success, silahkan login!",
    });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

const usernameValidasi = (un) => {
  const re = un.split(" ").join("");
  return re.toLowerCase();
};
