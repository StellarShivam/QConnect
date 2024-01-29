const Post = require("../models/postModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

exports.fetchAllPosts = (req, res, next) => {
  const userId = req.userId;
  Post.find({ creator: { $ne: userId } })
    .then((posts) => {
      res.json({ message: "Fetched posts successfully", posts: posts });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};

exports.fetchMyPosts = (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  Post.find({ creator: userId })
    .then((posts) => {
      res.json({ message: "Fetched my posts successfully", posts: posts });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};

exports.fetchComments = (req, res, next) => {
  const userId = req.userId;
  const postId = req.params.postId;
  Chat.find({ isPostChat: true, post: postId })
    .then((fetchedChat) => {
      if (fetchedChat.length == 0) {
        const newCommentChat = new Chat({
          chatName: "comment",
          isPostChat: true,
          users: [userId],
          groupAdmin: userId,
          post: postId,
        });
        newCommentChat
          .save()
          .then((result) => {
            // res.json({ message: "No messages found for post" });
            // next();
          })
          .catch((err) => {
            res
              .status(err.statusCode || 500)
              .json({ message: err.message, data: err.data });
          });
      }
      return Message.find({ chat: fetchedChat._id }).populate(
        "sender",
        "name pic email"
      );
    })
    .then((messages) => {
      res.json({ info: "messages fetched", message: messages });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};

exports.sendComment = (req, res, next) => {
  const sender = req.userId;
  const chatId = req.params.chatId;
  const nComment = req.body.comment;
  if (nComment.length == 0) {
    res.status(400);
    throw new Error("Please enter message");
  }

  const newComment = new Message({
    sender: sender,
    content: nComment,
    chat: chatId,
  });
  newComment
    .save()
    .then((savedComment) => {
      res.json({ message: "comment posted", comment: savedComment });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};

exports.createPost = (req, res, next) => {
  const { image, text } = req.body;
  const creator = req.userId;
  const newPost = new Post({ image: image, text: text, creator: creator });
  newPost
    .save()
    .then((savedPost) => {
      res.json({ message: "Post Created Successfully", post: savedPost });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Chat.findOne({ post: postId })
    .then((chat) => {
      if (!chat) {
        return;
      }
      return Message.deleteMany({ chat: chat._id })
        .then((deletedMessages) => {
          return Chat.deleteOne({ _id: chat._id });
        })
        .then((deletedChat) => {
          return deletedChat;
        })
        .catch((err) => {
          res
            .status(err.statusCode || 500)
            .json({ message: err.message, data: err.data });
        });
    })
    .then((deletedChat) => {
      return Post.findOneAndDelete({ _id: postId })
        .then((removedPost) => {
          //   res.json({
          //     message: "Post Deleted Successfully",
          //     removedPost: removedPost,
          //   });
          return removedPost;
        })
        .catch((err) => {
          res
            .status(err.statusCode || 500)
            .json({ message: err.message, data: err.data });
        });
    })
    .then((removedPost) => {
      res.json({
        message: "Post Deleted Successfully",
        removedPost: removedPost,
      });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
  //we also need to delete the comments and chat releated to that post
};

exports.deleteComment = (req, res, next) => {
  const userId = req.userId;
};
