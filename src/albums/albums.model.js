const mongoose = require('mongoose');

const albumModel = new mongoose.Schema({
  name: String,
  cover: String,
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
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

albumModel.index({ name: 1 });
module.exports = mongoose.model('Album', albumModel);
