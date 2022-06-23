const express = require("express");
const { registerUser, loginUser, followUser, unfollowUser, getDetails } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/follow/:id", followUser);
router.put("/unfollow/:id", unfollowUser);
router.get("/:id", getDetails);

module.exports = router;
