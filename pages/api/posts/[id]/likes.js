import Posts from "models/postModel";
import auth from "middleware/auth";
import connectDB from "utils/connectDB";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await likePost(req, res);
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." });
      break;
  }
};

const likePost = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (!result.id)
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const post = await Posts.findById(id);

    if (!post) return res.status(400).json({ err: `No post with id: ${id}` });

    const index = post.likes.indexOf(result.id);

    if (index === -1) {
      post.likes.push(result.id);
    } else {
      post.likes = post.likes.filter((id) => String(id) !== String(result.id));
    }
    const updatedPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    return res.json({
      status: "success",
      message: "Berhasil",
      data: updatedPost,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
