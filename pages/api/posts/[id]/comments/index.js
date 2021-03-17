import Posts from "models/postModel";
import auth from "middleware/auth";
import connectDB from "utils/connectDB";
import initMiddleware from "lib/init-middleware";
import validateMiddleware from "lib/validate-middleware";
import { check, validationResult } from "express-validator";

connectDB();

const validateBody = initMiddleware(
  validateMiddleware(
    [check("text", "Comment tidak boleh kosong").notEmpty()],
    validationResult
  )
);

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await validateBody(req, res);
      await commentPost(req, res);
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." });
      break;
  }
};

const commentPost = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (!result)
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const post = await Posts.findById(id);

    if (!post) return res.status(400).json({ err: `No post with id: ${id}` });

    const comment = {
      text: req.body.text,
      commentBy: result.id,
    };
    const updatedPost = await Posts.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      {
        new: true,
      }
    ).populate("comments.commentBy", "_id fullname username");

    return res.json({
      status: "success",
      message: "Comment success!",
      data: updatedPost,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
