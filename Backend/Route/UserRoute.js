const express = require("express");
const { registerUser, authUser, FetchAllUser } = require("../Controller/UserController");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();
router.route("/signup").post(registerUser);
router.route("/login").post(authUser);
router.route("/alluser").get(protect, FetchAllUser);
module.exports = router;
