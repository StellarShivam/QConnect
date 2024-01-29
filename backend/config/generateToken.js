const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId }, "somesupersecretsecret", { expiresIn: "1h" });
};

module.exports = generateToken;
