const express = require("express");
const postControllers = require("../controllers/postControllers");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/", isAuth, postControllers.createPost);
router.post("/comment/:chatId", isAuth, postControllers.sendComment);
router.get("/getComments/:postId", isAuth, postControllers.fetchComments);
router.get("/myPosts", isAuth, postControllers.fetchMyPosts);
router.get("/allPosts", isAuth, postControllers.fetchAllPosts);
router.delete("/deletePost/:postId", isAuth, postControllers.deletePost);
router.delete(
  "/deleteComment/:commentId",
  isAuth,
  postControllers.deleteComment
);

module.exports = router;
