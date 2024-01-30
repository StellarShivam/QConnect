const mongoose = require("mongoose");

const postsModel = mongoose.Schema(
  {
    image: { type: String, required: true },
    text: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postsModel);

module.exports = Post;
