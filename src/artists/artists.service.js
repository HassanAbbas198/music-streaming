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
}

module.exports = Service;
