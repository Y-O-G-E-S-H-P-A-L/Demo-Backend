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
      res.status(500).json(err);
    }
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please enter valid details." });
  }
  const user = await User.findOne({ email: email }); //---------> email validation
  if (user) {
    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      userLogin = user;
      res.status(200).json({ message: "Login successfully.", user });
    } else {
      res.status(400).json({ error: " Email or Password is incorrect." });
    }
  } else {
    res.status(400).json({ error: "Email or Password is incorrect." });
  }
};

// Get User Details
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: "User not found !!" });
  }
};

// Get All User
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(403).json({ error: "No user Found !!" });
  }
};

// Send Request
exports.sendRequest = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const sender = await User.findById(req.body.userId);
      const reciever = await User.findById(req.params.id);

      if (!reciever.friends.includes(sender._id)) {
        if (!reciever.pendings.includes(sender._id)) {
          if (!sender.pendings.includes(reciever._id)) {
            await reciever.updateOne({ $push: { pendings: sender._id } });
            res.status(200).json({ message: "Send request successfully !!" });
          } else {
            res.status(403).json({ error: "User already requested you !!" });
          }
        } else {
          res.status(403).json({ error: "Already sent request !!" });
        }
      } else {
        res.status(403).json({ error: "You both are already friends !!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({ error: "You can't request yourself !!" });
  }
};

// Accept  Request
exports.acceptRequest = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const sender = await User.findById(req.body.userId);
    const reciever = await User.findById(req.params.id);

    if (sender.pendings.includes(reciever._id)) {
      await sender.updateOne({ $push: { friends: reciever._id } });
      await reciever.updateOne({ $push: { friends: sender._id } });
      await sender.updateOne({ $pull: { pendings: reciever._id } });
    } else {
      res.status(403).json({ error: "You get request already !!" });
    }
    res.status(200).json({ message: "Accepted Successfully !!" });
  } else {
    res.status(403).json({ error: "You can't request yourself !!" });
  }
};

// Reject Request
exports.rejectRequest = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const sender = await User.findById(req.body.userId);
    const reciever = await User.findById(req.params.id);

    await sender.updateOne({ $pull: { pendings: reciever._id } });
    res.status(200).json({ message: "Reject Request Successfully !!" });
  } else {
    res.status(403).json({ error: "You cant unfollow yourself !!" });
  }
};

// Get All Requests
exports.getRequests = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.status(200).json({ Pendings: user.pendings });
  } catch (err) {
    res.status(404).json({ error: "No Requests Found !!" });
  }
};

// Get All Friends
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.status(200).json({ Friends: user.friends });
  } catch (err) {
    res.status(404).json({ error: "No Friends Found !!" });
  }
};
