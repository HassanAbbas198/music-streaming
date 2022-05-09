const mongoose = require('mongoose');
const Album = require('./albums.model');
const GlobalService = require('../utils/globalService');

class Service {
  constructor() {
    this.globalService = new GlobalService();
  }

  async createAlbum(body, user) {
    const { name, cover, artist } = body;

    const album = new Album({
      name,
      cover,
      artist,
      createdDate: new Date(),
      createdBy: user._id
    });
    return album.save();
  }

  async getAllAlbums(id) {
    const match = {};
    if (id) {
      match._id = mongoose.Types.ObjectId(id);
    }
    const aggregation = [
      {
        $match: match
      },
      // getting the artist of the album
      {
        $lookup: {
          from: 'artists',
          localField: 'artist',
          foreignField: '_id',
          as: 'artist'
        }
      },
      {
        $unwind: {
          path: '$artist',
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
          artist: '$artist.name'
        }
      }
    ];
    return Album.aggregate(aggregation);
  }

  async getAlbumDetails(params) {
    const { id } = params;

    const albums = await this.getAllAlbums(id);

    if (!albums || !albums.length) {
      throw new Error('notFound');
    }
    // increment the number of clicks by 1
    await Album.updateOne({ _id: id }, {
      $inc: {
        clicks: 1
      }
    });
    return albums[0];
  }

  async updateAlbum(body, params, user) {
    const { id } = params;

    // check if the album exists in the DB
    const album = await Album.findOne({ _id: id });
    if (!album) {
      throw new Error('notFound');
    }

    // resticting the users from updating albums that weren't created by them
    if (user._id.toString() !== album.createdBy.toString()) {
      throw new Error('forbidden');
    }

    const updates = {
      ...body,
      updatedDate: new Date(),
      updatedBy: user._id
    };
    return Album.updateOne({ _id: id }, {
      $set: updates
    });
  }

  async deleteAlbum(params, user) {
    const { id } = params;

    const album = await Album.findOne({ _id: id });
    if (!album) {
      throw new Error('notFound');
    }
    if (user._id.toString() !== album.createdBy.toString()) {
      throw new Error('forbidden');
    }
    return Album.deleteOne({ _id: id });
  }
}

module.exports = Service;
