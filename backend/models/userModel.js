const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", required: true, unique: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
