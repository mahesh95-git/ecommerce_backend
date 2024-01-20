const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userschema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
    maxlength: [30, "Name cannot exceed 30 characters"],
    minlength: [4, "Name should be more then 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your  Email"],
    unique: true,
    validate: [validator.default.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your  Passwrod"],
    minlength: [8, "Password should be greater then 8 characters"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userschema.methods.creatJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
userschema.methods.PasswordMatched = async function (userpassword) {
  return await bcrypt.compare(userpassword, this.password);
};
userschema.methods.getResetPasswordToken = function () {
  const resettoken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resettoken;
};
exports.user = mongoose.model("user", userschema);
