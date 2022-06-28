const express = require("express");
const { registerUser, loginUser, getAllUser, getUser, getLoggedInUser, sendRequest, rejectRequest, acceptRequest } = require("../controllers/userController");
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
router.get("/loggedInUser", getLoggedInUser);
router.get("/", getAllUser);

module.exports = router;
