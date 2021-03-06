const express = require("express");
const { registerUser, loginUser, getAllUser, getUser, sendRequest, rejectRequest, acceptRequest, getRequests, getFriends } = require("../controllers/userController");
const router = express.Router();
// auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Connection Request
router.put("/sendRequest/:id", sendRequest);
router.put("/acceptRequest/:id", acceptRequest);
router.put("/rejectRequest/:id", rejectRequest);

// User Details
router.get("/:id", getUser);
router.get("/", getAllUser);

// Get Requests and Friends
router.get("/requests/:id", getRequests);
router.get("/friends/:id", getFriends);

module.exports = router;
