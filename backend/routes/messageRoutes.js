const express = require("express");
const messageController = require("../controllers/messageControllers");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/", isAuth, messageController.sendMessage);
router.get("/allMessages/:chatId", isAuth, messageController.allMessages);

module.exports = router;
