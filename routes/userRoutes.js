const express = require("express");
const { registerUser, loginUser, followUser, unfollowUser } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/follow/:id", followUser);
router.put("/unfollow/:id", unfollowUser);

module.exports = router;
