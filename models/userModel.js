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
  },
  contact: {
    type: Number,
    required: true,
  },
  Picture: {
    data: Buffer,
    contentType: String,
  },
  location: {
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
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

  pending: [
    {
      status: {
        type: Boolean,
      },
      pendingUser: {
        type: String,
      },
    },
  ],
  connected: [
    {
      status: {
        type: Boolean,
      },
      connectedUser: {
        type: String,
      },
    },
  ],
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
