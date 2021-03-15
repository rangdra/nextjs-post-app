import Users from "models/userModel";
import auth from "middleware/auth";
import connectDB from "utils/connectDB";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProfileUser(req, res);
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." });
      break;
  }
};

const getProfileUser = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (!result)
      return res.status(400).json({ err: "Authentication is not valid." });

    const user = await Users.findById(result.id).select("-password");

    res.json({
      status: "success",
      message: "Berhasil memanggil data profile",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
