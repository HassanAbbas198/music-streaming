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

  async getAllArtists(req, res, next) {
    try {
      const result = await artistsService.getAllArtists();
      res.send(result);
    } catch (e) {
      next(new ArtistsException(500, e.message));
    }
  }

  async getArtistDetails(req, res, next) {
    try {
      const result = await artistsService.getArtistDetails(req.params);
      res.send(result);
    } catch (e) {
      if (e.message === 'notFound') {
        next(new ArtistsException(404, e.message));
      } else {
        next(new ArtistsException(500, e.message));
      }
    }
  }

  async updateArtist(req, res, next) {
    try {
      await artistsService.updateArtist(req.body, req.params, req.user);
      res.end();
    } catch (e) {
      if (e.message === 'notFound') {
        next(new ArtistsException(404, e.message));
      } else if (e.message === 'forbidden') {
        next(new ArtistsException(403, e.message));
      } else {
        next(new ArtistsException(500, e.message));
      }
    }
  }

  async deleteArtist(req, res, next) {
    try {
      await artistsService.deleteArtist(req.params, req.user);
      res.end();
    } catch (e) {
      if (e.message === 'notFound') {
        next(new ArtistsException(404, e.message));
      } else if (e.message === 'forbidden') {
        next(new ArtistsException(403, e.message));
      } else {
        next(new ArtistsException(500, e.message));
      }
    }
  }

  initializeRoutes() {
    this.router.use(`${this.path}`, authenticate());
    this.router.post(`${this.path}/`, validate(validation.createArtist), this.createArtist);
    this.router.get(`${this.path}/:id`, validate(validation.getOrDeleteArtist), this.getArtistDetails);
    this.router.get(`${this.path}`, this.getAllArtists);
    this.router.put(`${this.path}/:id`, validate(validation.updateArtist), this.updateArtist);
    this.router.delete(`${this.path}/:id`, validate(validation.getOrDeleteArtist), this.deleteArtist);
  }
}

module.exports = Controller;
