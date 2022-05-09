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
          updatedDate: 1,
          updatedBy: '$user.email'
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
    return artist;
  }

  async updateArtist(body, params, user) {
    const { id } = params;

    // check if the artist exists in the DB
    const artist = await Artist.findOne({ _id: id });
    if (!artist) {
      throw new Error('notFound');
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

  async deleteArtist(params) {
    const { id } = params;

    const artist = await Artist.findOne({ _id: id });
    if (!artist) {
      throw new Error('notFound');
    }
    return Artist.deleteOne({ _id: id });
  }
}

module.exports = Service;
