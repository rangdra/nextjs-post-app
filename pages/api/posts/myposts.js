import Posts from "models/postModel";
import auth from "middleware/auth";
import connectDB from "utils/connectDB";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getMyPosts(req, res);
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." });
      break;
  }
};

const getMyPosts = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (!result) {
      return res.status(400).json({ err: "Authentication is not valid." });
    }

    const myposts = await Posts.find({ postedBy: result.id })
      .sort({ createdAt: -1 })
      .populate("postedBy", "_id username fullname email avatar");

    return res.json({
      status: "success",
      message: "Success mengambil data posts by user!",
      data: myposts,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
