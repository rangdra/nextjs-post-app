import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const postSchema = mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    postedBy: {
      type: ObjectId,
      ref: "user",
    },
    // likes: [
    //   {
    //     type: ObjectId,
    //     ref: "User",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);
let Dataset = mongoose.models.post || mongoose.model("post", postSchema);
export default Dataset;
