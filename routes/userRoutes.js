const express = require("express");
const User = require("../models/userModel");
const { registerUser, loginUser } = require("../controllers/userController");
const router = express.Router();
const multer = require("multer");

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: Storage }).single("profilePicture");

router.post("/register", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
    } else {
      let name;
      if (!name || !email || !password || !cPassword) {
        return res.status(422).json({ error: "Please fill the form completely" });
      }
      try {
        const finduserExist = await User.findOne({ email: email });
        if (finduserExist) {
          return res.status(422).json({ error: "Email allready exist" });
        } else if (password != cPassword) {
          return res.status(422).json({ error: "Password not match" });
        } else {
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            profilePicture: {
              data: req.file.filename,
              contentType: "image/*",
            },
            location: req.body.location,
            password: req.body.password,
            cPassword: req.body.cPassword,
          });
          // ---- before saving bycrpt is running in userSchema ----
          await user.save();
          console.log(`Registered Successfully.`);
          res.status(201).json({ message: "Registered Successfully." });
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
});

// router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
