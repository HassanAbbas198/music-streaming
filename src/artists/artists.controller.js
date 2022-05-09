const express = require('express');
const validate = require('express-validation');
const validation = require('./artists.validation');
const ArtistsException = require('./artists.exception');
const ArtistsService = require('./artists.service');
const authenticate = require('../middleware/authenticate');

const artistsService = new ArtistsService();

class Controller {
  constructor() {
    this.path = '/artists';
    this.router = express.Router();
    this.initializeRoutes();
  }

  async createArtist(req, res, next) {
    try {
      const result = await artistsService.createArtist(req.body, req.user);
      res.send(result);
    } catch (e) {
      next(new ArtistsException(500, e.message));
    }
  }

  initializeRoutes() {
    this.router.use(`${this.path}`, authenticate());
    this.router.post(`${this.path}/`, validate(validation.createArtist), this.createArtist);
  }
}

module.exports = Controller;
