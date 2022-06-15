const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Register User
exports.registerUser = async (req, res) => {
  //createing post req for registration

  const { name, email, contact, Picture, location, password, cPassword } = req.body;

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
      const user = new User({ name, email, contact, Picture, location, password, cPassword });
      // ---- before saving bycrpt is running in userSchema ----
      await user.save();
      console.log(`User Registered Successfully.`);

      res.status(201).json({ message: "successfully saved" });
    }
  } catch (err) {
    console.log(err);
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "please fill the form" });
    }

    const UserExist = await User.findOne({ email: email }); //---------> email validation

    if (UserExist) {
      const MatchingPasswords = await bcrypt.compare(password, UserExist.password);

      if (!MatchingPasswords) {
        res.status(400).json({ error: " Email or Password is incorrect." });
      } else {
        res.json({ message: "Login successfully." });
        console.log("Login successfully.");
      }
    } else {
      res.status(400).json({ error: "Email and Password is wrong" });
    }
  } catch (err) {
    console.log(err);
  }
};
