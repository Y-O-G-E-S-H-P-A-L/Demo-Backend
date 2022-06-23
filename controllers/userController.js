const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, contact, profilePicture, location, password, cPassword } = req.body;

  if (!name || !email || !password || !cPassword) {
    return res.status(400).json({ error: "Please fill the form completely" });
  } else {
    try {
      const finduserExist = await User.findOne({ email: email });
      if (finduserExist) {
        return res.status(422).json({ error: "Email allready Registered. Please Login !!" });
      } else if (password != cPassword) {
        return res.status(422).json({ error: "Passwords not match" });
      } else {
        const user = new User({ name, email, contact, profilePicture, location, password, cPassword });
        await user.save();
        console.log(`Registered Successfully.`);
        res.status(201).json({ message: "Registered Successfully." });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please enter valid details." });
  }

  const existingUser = await User.findOne({ email: email }); //---------> email validation

  if (existingUser) {
    const MatchingPasswords = await bcrypt.compare(password, existingUser.password);
    if (!MatchingPasswords) {
      res.status(400).json({ error: " Email or Password is incorrect." });
    } else {
      res.json({ message: "Login successfully." });
      console.log("Login successfully.");
    }
  } else {
    res.status(400).json({ error: "Email or Password is incorrect." });
  }
};

// Get User Details
exports.getDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Follow a User
exports.followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("Followed Successfully !!");
      } else {
        res.status(403).json("You already follow this user !!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant follow yourself !!");
  }
};

// Unfollow a User
exports.unfollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("Unfollowed Successfully !!");
      } else {
        res.status(403).json("You can't unfollow this user !!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant unfollow yourself !!");
  }
};
