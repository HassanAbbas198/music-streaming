const mongoose = require('mongoose');

const artistModel = new mongoose.Schema({
  name: String,
  cover: String,
  clicks: {
    type: Number,
    default: 0
  },
  createdDate: Date,
  updatedDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
module.exports = mongoose.model('Artist', artistModel);
