const Artist = require('./artists.model');
const GlobalService = require('../utils/globalService');

class Service {
  constructor() {
    this.globalService = new GlobalService();
  }

  async createArtist(body, user) {
    const { name, cover } = body;

    const artist = new Artist({
      name,
      cover,
      createdDate: new Date(),
      createdBy: user._id
    });
    return artist.save();
  }

  async getAllArtists() {
    const aggregation = [
      // getting the user who updated the artist
      {
        $lookup: {
          from: 'users',
          localField: 'updatedBy',
          foreignField: '_id',
          as: 'user'
        }
      },
      // converting the array to an object
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      // projecting the needed fields
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          cover: 1,
          clicks: 1,
          createdDate: 1,
          updatedDate: 1,
          updatedBy: '$user.email'
        }
      },
      {
        $sort: {
          createdDate: -1
        }
      }
    ];
    return Artist.aggregate(aggregation);
  }

  async getArtistDetails(params) {
    const { id } = params;

    // check if the artist exists in the DB
    const artist = await Artist.findOne({ _id: id });
    if (!artist) {
      throw new Error('notFound');
    }
    // increment the number of clicks by 1
    await Artist.updateOne({ _id: id }, {
      $inc: {
        clicks: 1
      }
    });
    return artist;
  }

  async updateArtist(body, params, user) {
    const { id } = params;

    // check if the artist exists in the DB
    const artist = await Artist.findOne({ _id: id });
    if (!artist) {
      throw new Error('notFound');
    }

    // resticting the users from deleting artists that weren't created by them
    if (user._id.toString() !== artist.createdBy.toString()) {
      throw new Error('forbidden');
    }

    const updates = {
      ...body,
      updatedDate: new Date(),
      updatedBy: user._id
    };
    return Artist.updateOne({ _id: id }, {
      $set: updates
    });
  }

  async deleteArtist(params, user) {
    const { id } = params;

    const artist = await Artist.findOne({ _id: id });
    if (!artist) {
      throw new Error('notFound');
    }
    if (user._id.toString() !== artist.createdBy.toString()) {
      throw new Error('forbidden');
    }
    return Artist.deleteOne({ _id: id });
  }
}

module.exports = Service;
