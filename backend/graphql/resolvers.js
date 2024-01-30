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
  },
};
