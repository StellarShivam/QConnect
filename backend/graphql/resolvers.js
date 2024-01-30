const User = require("../models/userModel");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const Post = require("../models/postModel");
const generateToken = require("../config/generateToken");

const bcrypt = require("bcryptjs");
const validator = require("validator"); //used to apply validation in graphql
const jwt = require("jsonwebtoken");

module.exports = {
  signup: async function (args, req) {
    const { name, email, password, pic } = args.userInput;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User already exists");
      throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPw,
      pic: pic,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  signin: async function (args, req) {
    const { email, password } = args;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect");
      error.code = 401;
      throw error;
    }
    const token = generateToken(user._id.toString());
    return { token: token, userId: user._id.toString() };
  },
  fetchAllPosts: async function (args, req) {
    const userId = req.userId;
    const posts = await Post.find({ creator: { $ne: userId } }).populate(
      "creator",
      "name email pic"
    );
    return { posts: posts };
  },
  fetchMyPosts: async function (args, req) {
    const userId = req.userId;
    const posts = await Post.find({ creator: userId }).populate(
      "creator",
      "name email pic"
    );
    return { posts: posts };
  },
  fetchComments: async function (args, req) {
    const { postId } = args;
    const userId = req.userId;
    const fetchedChat = await Chat.find({ isPostChat: true, post: postId });
    if (fetchedChat.length == 0) {
      const newCommentChat = new Chat({
        chatName: "comment",
        isPostChat: true,
        users: [userId],
        groupAdmin: userId,
        post: postId,
      });
      await newCommentChat.save();
      return { comments: [] };
    }
    const messages = await Message.find({ chat: fetchedChat._id });
    return { comments: messages };
  },
  sendComment: async function (args, req) {
    const { chatId, content } = args;
    const userId = req.userId;
    const newComment = new Message({
      sender: userId,
      content: content,
      chat: chatId,
    });
    const createdComment = await newComment.save();
    return {
      ...createdComment._doc,
      _id: createdComment._id.toString(),
    };
  },
  createPost: async function (args, req) {
    const { image, text } = args.postInputData;
    const userId = req.userId;
    const newPost = new Post({
      image: image,
      text: text,
      creator: userId,
    });
    const createdPost = await newPost.save();
    return { ...createdPost._doc, _id: createdPost._id.toString() };
  },
  deletePost: async function (args, req) {
    const { postId } = args;
    const chat = await Chat.findOne({ post: postId });
    if (postChat) {
      await Message.deleteMany({ chat: chat._id });
      await Chat.deleteOne({ _id: chat._id });
    }
    const deletedPost = await Post.findOneAndDelete({ _id: postId });
    return { ...deletedPost._doc, _id: deletedPost._id.toString() };
  },
  sendMessage: async function (args, req) {
    const { chatId, content } = args;
    const userId = req.userId;
    const newMessage = new Message({
      sender: userId,
      content: content,
      chat: chatId,
    });
    const createdMessage = await newMessage.save();
    await Chat.findByIdAndUpdate(chatId, { latestMessage: savedMessage });

    createdMessage = await Message.findById(createdMessage._id)
      .populate("sender", "name pic")
      .populate("chat");

    createdMessage = await User.populate(createdMessage, {
      path: "chat.users",
      select: "name pic email",
    });
    return { ...createdMessage._doc, _id: createdMessage._id.toString() };
  },
  allMessages: async function (args, req) {
    const { chatId } = args;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    return { ...messages._doc, _id: messages._id.toString() };
  },
  accessChat: async function (args, req) {
    const { userId } = args;
    const userId2 = req.userId;
    const chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: userId2 } } },
      ],
    });
    if (chat.length == 0) {
      const newChat = new Chat({
        chatName: "personal",
        isGroupChat: false,
        isPostChat: false,
        users: [userId, userId2],
      });
      const createdChat = await newChat.save();
      createdChat = User.populate(createdChat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      createdChat = User.populate(createdChat, {
        path: "users",
        select: "name pic email",
      });
      return { ...createdChat._doc, _id: createdChat._id.toString() };
    }
    chat = User.populate(chat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    chat = User.populate(chat, {
      path: "users",
      select: "name pic email",
    });
    return { ...chat._doc, _id: chat._id.toString() };
  },
  fetchChats: async function (args, req) {
    const userId = req.userId;
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: userId } },
      isPostChat: false,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = User.populate(chats, {
      path: "lastMessage.sender",
      select: "name pic email",
    });

    return { chats: chats };
  },
  createGroupChat: async function (args, req) {
    const { chatName, users } = args;
    const admin = req.userId;
    users.push(admin);
    const newGroupChat = new Chat({
      chatName: groupName,
      isGroupChat: true,
      isPostChat: false,
      users: users,
      groupAdmin: admin,
    });
    const createdGroupChat = await newGroupChat.save();
    createdGroupChat = Chat.findOne({ _id: createdGroupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return { ...createdGroupChat._doc, _id: createdGroupChat._id.toString() };
  },
  renameGroup: async function (args, req) {
    const { chatId, newChatName } = args;
    const group = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!group) {
    }
    return { ...group._doc, _id: group._id.toString() };
  },
  addToGroup: async function (args, req) {
    const { chatId, userId } = args;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
    }
    return { ...updatedChat._doc, _id: updatedChat._id.toString() };
  },
  removeFromGroup: async function (args, req) {
    const { chatId, userId } = args;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
    }
    return { ...updatedChat._doc, _id: updatedChat._id.toString() };
  },
};

//we need to convert the return types to strings
