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
        res.status(200).json({ message: "Registered Successfully." });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

let loggedInUser = {};
// Get Logged in User
exports.getLoggedInUser = (req, res) => {
  return res.json({ loggedInUser });
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please enter valid details." });
  }
  const user = await User.findOne({ email: email }); //---------> email validation
  if (user) {
    const MatchingPasswords = await bcrypt.compare(password, user.password);
    if (!MatchingPasswords) {
      res.status(400).json({ error: " Email or Password is incorrect." });
    } else {
      loggedInUser = user;
      res.json({ message: "Login successfully.", user });
    }
  } else {
    res.status(400).json({ error: "Email or Password is incorrect." });
  }
};
// Get User Profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get All User
exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err);
  }
};

// Send Request
exports.sendRequest = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const sender = await User.findById(req.body.userId);
      const receiver = await User.findById(req.params.id);

      if (!receiver.pendings.includes(sender._id)) {
        if (!receiver.friends.include(sender._id)) {
          await receiver.updateOne({ $push: { pendings: sender._id } });
        } else {
          res.status(403).json({ error: "You both are already friends !!" });
        }
        res.status(200).json({ message: "Send Request Successfully !!" });
      } else {
        res.status(403).json({ error: "You already send request to this user !!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({ error: "You can't send request yourself !!" });
  }
};

// Accept  Request
exports.acceptRequest = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const sender = await User.findById(req.body.id);
      const receiver = await User.findById(req.params.userId);

      if (sender.pendings.includes(receiver._id)) {
        await sender.updateOne({ $push: { friends: receiver._id } });
        await receiver.updateOne({ $push: { friends: sender._id } });

        await sender.updateOne({ $pull: { pendings: receiver._id } });
        await receiver.updateOne({ $pull: { pendings: sender._id } });

        res.status(200).json({ message: "Accepted Successfully !!" });
      } else {
        res.status(403).json({ error: "You both are already friends !!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({ error: "You cant accept request yourself !!" });
  }
};

// Reject Request
exports.rejectRequest = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const sender = await User.findById(req.body.id);
      const receiver = await User.findById(req.params.userId);

      if (!user.pendings.includes(req.body.userId)) {
        await sender.updateOne({ $pull: { pendings: receiver._id } });
        await receiver.updateOne({ $pull: { pendings: sender._id } });
        res.status(200).json({ message: "Reject Request Successfully !!" });
      } else {
        res.status(403).json({ error: "You already unfollow this user !!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({ error: "You cant unfollow yourself !!" });
  }
};
