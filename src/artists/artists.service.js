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
}

module.exports = Service;
