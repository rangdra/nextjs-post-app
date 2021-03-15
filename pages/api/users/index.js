import Users from "models/userModel";
import auth from "middleware/auth";
import connectDB from "utils/connectDB";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getAllUsers(req, res);
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." });
      break;
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const users = await Users.find().select(
      "_id fullname username email role avatar"
    );

    res.json({
      status: "success",
      message: "Berhasil memanggil data semua user | admin only",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
