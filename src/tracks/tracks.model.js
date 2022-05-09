const mongoose = require('mongoose');

const trackModel = new mongoose.Schema({
  name: String,
  cover: String,
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
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
// adding index on the artist because we are queriying on it when getting all artists
trackModel.index({ artist: 1 });
module.exports = mongoose.model('Track', trackModel);
