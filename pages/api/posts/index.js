import initMiddleware from "lib/init-middleware";
import validateMiddleware from "lib/validate-middleware";
import { check, validationResult } from "express-validator";
import Posts from "models/postModel";
import auth from "middleware/auth";
import connectDB from "utils/connectDB";

connectDB();

const validateBody = initMiddleware(
  validateMiddleware(
    [check("body", "Body tidak boleh kosong").notEmpty()],
    validationResult
  )
);

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getPosts(req, res);
      break;
    case "POST":
      await validateBody(req, res);
      await createPost(req, res);
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." });
      break;
  }
};

const createPost = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (!result.id)
      return res.status(400).json({ err: "Authentication is not valid." });

    const { body, tags } = req.body;

    const newPost = new Posts({
      body,
      tags,
      postedBy: result.id,
    });

    await newPost.save();

    res.json({
      status: "success",
      message: "Success create post!",
      data: newPost,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getPosts = async (req, res) => {
  const currPage = req.query.page || 1;
  const perPage = req.query.perPage || 6;

  try {
    const totalData = await Posts.find().countDocuments();

    const posts = await Posts.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "postedBy",
        select: "-password",
      })
      .skip((currPage - 1) * perPage)
      .limit(perPage);

    // 1 kecil > besar , -1 besar/terlama > kecil/terbaru

    return res.json({
      status: "success",
      message: "Success mengambil data posts!",
      data: posts,
      total_data: totalData,
      per_page: perPage,
      page: currPage,
      max_page: Math.ceil(totalData / perPage),
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
