const mongoose = require('mongoose');
const Track = require('./tracks.model');
const GlobalService = require('../utils/globalService');

class Service {
  constructor() {
    this.globalService = new GlobalService();
  }

  async createTrack(body, user) {
    const { name, cover, album } = body;

    const track = new Track({
      name,
      cover,
      Album: album,
      createdDate: new Date(),
      createdBy: user._id
    });
    return track.save();
  }

  async getAllTracks(id) {
    const match = {};
    if (id) {
      match._id = mongoose.Types.ObjectId(id);
    }
    const aggregation = [
      {
        $match: match
      },
      // getting the artist of the track
      {
        $lookup: {
          from: 'albums',
          localField: 'Album',
          foreignField: '_id',
          as: 'album'
        }
      },
      {
        $unwind: {
          path: '$album',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          cover: 1,
          clicks: 1,
          album: '$album.name'
        }
      }
    ];
    return Track.aggregate(aggregation);
  }

  async getTrackDetails(params) {
    const { id } = params;

    const tracks = await this.getAllTracks(id);

    if (!tracks || !tracks.length) {
      throw new Error('notFound');
    }
    return tracks[0];
  }

  async updateTrack(body, params, user) {
    const { id } = params;

    // check if the track exists in the DB
    const track = await Track.findOne({ _id: id });
    if (!track) {
      throw new Error('notFound');
    }

    // resticting the users from updating tracks that weren't created by them
    if (user._id.toString() !== track.createdBy.toString()) {
      throw new Error('forbidden');
    }

    const updates = {
      ...body,
      updatedDate: new Date(),
      updatedBy: user._id
    };
    return Track.updateOne({ _id: id }, {
      $set: updates
    });
  }

  async deleteTrack(params, user) {
    const { id } = params;

    const track = await Track.findOne({ _id: id });
    if (!track) {
      throw new Error('notFound');
    }
    if (user._id.toString() !== track.createdBy.toString()) {
      throw new Error('forbidden');
    }
    return Track.deleteOne({ _id: id });
  }
}

module.exports = Service;
