const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateToken");

exports.registerUser = (req, res, next) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all required fields");
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        const error = new Error("No such user found");
        error.statusCode = 401;
        throw error;
      }
      bcrypt
        .hash(password, 12)
        .then((hashedPw) => {
          const newUser = new User({
            name: name,
            email: email,
            password: hashedPw,
            pic: pic,
          });
          return newUser.save();
        })
        .then((createdUser) => {
          res
            .status(201)
            .json({ message: "User Created", createdUser: createdUser });
        })
        .catch((err) => {
          res
            .status(err.statusCode || 500)
            .json({ message: err.message, data: err.data });
        });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};

exports.authUser = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("No such user found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong Password.");
        error.statusCode = 401;
        throw error;
      }
      res.json({ user: loadedUser, token: generateToken(loadedUser._id) });
    })
    .catch((err) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, data: err.data });
    });
};
