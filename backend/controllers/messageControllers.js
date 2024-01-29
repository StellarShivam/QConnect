const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

exports.sendMessage = (req, res, next) => {
  const userId = req.userId;
  const { message, chatId } = req.body;

  const newMessage = new Message({
    sender: userId,
    content: message,
    chat: chatId,
  });
  let savedMessage;

  newMessage
    .save()
    .then((result) => {
      return Message.findById(result._id).populate("sender").populate("chat");
    })
    .then((message) => {
      savedMessage = message;
      return Chat.findByIdAndUpdate(chatId, { latestMessage: savedMessage });
    })
    .then((chat) => {
      return Message.findById(savedMessage._id)
        .populate("sender", "name pic")
        .populate("chat");
    })
    .then((message) => {
      return User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });
    })
    .then((result) => {
      res.json({ message: result });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};

exports.allMessages = (req, res, next) => {
  const chatId = req.params.chatId;
  Message.find({ chat: chatId })
    .populate("sender", "-password")
    .populate("chat")
    .then((messages) => {
      res.json({ message: "All messages recieved", messages: messages });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};
