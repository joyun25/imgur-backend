const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "請輸入您的姓名"]
    },
    gender: {
      type: String,
      enum: ["male", "female"]
    },
    email: {
      type: String,
      required: [true, "請輸入您的 email"],
      unique: true,
      lowercase: true,
      select: false
    },
    password: {
      type: String,
      required: [true, "請輸入您的密碼"],
      minlength: 8,
      select: false
    },
    photo: {
      type: String,
      default: "",
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;