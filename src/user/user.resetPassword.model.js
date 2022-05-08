const mongoose = require('mongoose');

const userResetPassword = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  token: String,
  expiryDate: Date
});

userResetPassword.index({ token: 1 });
module.exports = mongoose.model('UserResetPassword', userResetPassword);
