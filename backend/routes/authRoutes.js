const express = require("express");
const authController = require("../controllers/authControllers");

const router = express.Router();

router.post("/signup", authController.registerUser);
router.post("/signin", authController.authUser);

module.exports = router;
