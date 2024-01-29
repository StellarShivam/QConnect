const Post = require("../models/postModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

exports.accessChat = (req, res, next) => {
  const userId = req.userId;
  const userId2 = req.params.userId;

  Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: userId2 } } },
    ],
  })
    .then((chat) => {
      return User.populate(chat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
    })
    .then((chat) => {
      if (chat.length > 0) {
        return chat[0];
      }
      const newChat = new Chat({
        chatName: "personal",
        isGroupChat: false,
        isPostChat: false,
        users: [userId, userId2],
      });
      return newChat.save();
    })
    .then((chat) => {
      return User.populate(chat, {
        path: "users",
        select: "name pic email",
      });
    })
    .then((result) => {
      res.json({ message: "chat accessed successfully", chat: result });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};

exports.fetchChats = (req, res, next) => {
  const userId = req.userId;
  Chat.find({ users: { $elemMatch: { $eq: userId } }, isPostChat: false })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then((results) => {
      return User.populate(results, {
        path: "lastMessage.sender",
        select: "name pic email",
      });
    })
    .then((result) => {
      res.json({ message: "Chats fetched succesfully", chats: result });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};

exports.createGroupChat = (req, res, next) => {
  const admin = req.userId;
  if (!req.body.users || !req.body.groupName) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  const { groupName, users } = req.body;
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(admin);
  const newGroupChat = new Chat({
    chatName: groupName,
    isGroupChat: true,
    isPostChat: false,
    users: users,
    groupAdmin: admin,
  });
  newGroupChat
    .save()
    .then((groupChat) => {
      return Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    })
    .then((result) => {
      res.json({
        message: "New group chat created successfully",
        groupChat: result,
      });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};

exports.renameGroup = (req, res, next) => {
  const { chatId, chatName } = req.body;

  Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .then((chat) => {
      if (!chat) {
        res.status(404);
        throw new Error("Chat Not Found");
      }
      res.json({ message: "Group name changed", chat: chat });
    });
};

exports.addToGroup = (req, res, next) => {
  const { userId, chatId } = req.body;

  Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .then((updatedChat) => {
      if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
      }
      res.json({
        message: "User successfully added to group",
        updatedChat: updatedChat,
      });
    });
};

exports.removeFromGroup = (req, res, next) => {
  const { userId, chatId } = req.body;

  Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .then((updatedChat) => {
      if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
      }
      res.json({
        message: "User successfully removed from group",
        updatedChat: updatedChat,
      });
    });
};
