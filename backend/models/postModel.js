const mongoose = require("mongoose");

const postsModel = mongoose.Schema(
  {
    image: { type: String },
    text: { type: String },
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
