const mongoose = require('mongoose');

const userVerification = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationToken: String
});

userVerification.index({ verificationToken: 1 });
module.exports = mongoose.model('UserVerification', userVerification);
