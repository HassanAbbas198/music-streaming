const mongoose = require('mongoose');

const userVerification = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  token: String
});

userVerification.index({ token: 1 });
module.exports = mongoose.model('UserVerification', userVerification);
