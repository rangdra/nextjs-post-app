import Posts from "models/postModel";
import auth from "middleware/auth";
import connectDB from "utils/connectDB";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getPost(req, res);
      break;
    case "PUT":
      await updatePost(req, res);
      break;
    case "DELETE":
      await deletePost(req, res);
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." });
      break;
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.query;

    const post = await Posts.findById(id).populate({
      path: "postedBy",
      select: "-password",
    });

    return res.json({
      status: "success",
      message: "Success mengambil detail post!",
      data: post,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (!result.id)
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    await Posts.findByIdAndDelete(id);

    return res.json({
      status: "success",
      message: "Success delete post.",
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (!result.id)
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { body, tags } = req.body;

    const post = await Posts.findById(id);

    if (post) {
      post.body = body || post.body;
      post.tags = tags || post.tags;

      post.save();

      return res.json({
        status: "success",
        message: "Success update post",
        data: post,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
