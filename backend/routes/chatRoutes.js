const express = require("express");
const isAuth = require("../middleware/is-auth");
const chatControllers = require("../controllers/chatControllers");

const router = express.Router();

router.get("/", isAuth, chatControllers.fetchChats);
router.get("/myChat/:userId", isAuth, chatControllers.accessChat);
router.post("/createGroup", isAuth, chatControllers.createGroupChat);
router.put("/renameGroup", isAuth, chatControllers.renameGroup);
router.put("/addUserToGroup", isAuth, chatControllers.addToGroup);
router.put("/removeUserFromGroup", isAuth, chatControllers.removeFromGroup);

module.exports = router;
