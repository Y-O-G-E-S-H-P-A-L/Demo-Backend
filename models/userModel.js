const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: Number,
    default: 00,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  location: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  cPassword: {
    type: String,
    required: true,
  },
  checkbox: {
    type: Boolean,
    default: true,
  },
  friends: {
    type: Array,
    default: [],
  },
  requests: {
    type: Array,
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      this.cPassword = await bcrypt.hash(this.cPassword, 10);
    }
  } catch (err) {
    console.log(err);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
