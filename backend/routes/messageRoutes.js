const express = require("express");
const messageController = require("../controllers/messageControllers");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/", isAuth, messageController.sendMessage);

module.exports = router;
