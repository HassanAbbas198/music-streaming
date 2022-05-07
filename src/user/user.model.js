const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
  email: String,
  password: String,
  locked: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  passwordAttempts: {
    type: Number,
    default: 0
  },
  token: String,
  dateOfBirth: Date,
  registrationDate: Date
});

userModel.index({ email: 1 });
module.exports = mongoose.model('User', userModel);
