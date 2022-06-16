const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

const router = express.Router();

router.app(express.static(__dirname + "../uploads"));

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;
