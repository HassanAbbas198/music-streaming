const mongoose = require('mongoose');

const trackModel = new mongoose.Schema({
  name: String,
  cover: String,
  Album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
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

module.exports = mongoose.model('Track', trackModel);
