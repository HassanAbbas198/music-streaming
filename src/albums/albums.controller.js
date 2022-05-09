const express = require('express');
const validate = require('express-validation');
const validation = require('./albums.validation');
const AlbumsException = require('./albums.exception');
const AlbumsService = require('./albums.service');
const authenticate = require('../middleware/authenticate');

const albumsService = new AlbumsService();

class Controller {
  constructor() {
    this.path = '/albums';
    this.router = express.Router();
    this.initializeRoutes();
  }

  async createAlbum(req, res, next) {
    try {
      const result = await albumsService.createAlbum(req.body, req.user);
      res.send(result);
    } catch (e) {
      next(new AlbumsException(500, e.message));
    }
  }

  async getAllAlbums(req, res, next) {
    try {
      const result = await albumsService.getAllAlbums();
      res.send(result);
    } catch (e) {
      next(new AlbumsException(500, e.message));
    }
  }

  async getAlbumDetails(req, res, next) {
    try {
      const result = await albumsService.getAlbumDetails(req.params);
      res.send(result);
    } catch (e) {
      if (e.message === 'notFound') {
        next(new AlbumsException(404, e.message));
      } else {
        next(new AlbumsException(500, e.message));
      }
    }
  }

  async updateAlbum(req, res, next) {
    try {
      await albumsService.updateAlbum(req.body, req.params, req.user);
      res.end();
    } catch (e) {
      if (e.message === 'notFound') {
        next(new AlbumsException(404, e.message));
      } else if (e.message === 'forbidden') {
        next(new AlbumsException(403, e.message));
      } else {
        next(new AlbumsException(500, e.message));
      }
    }
  }

  async deleteAlbum(req, res, next) {
    try {
      await albumsService.deleteAlbum(req.params, req.user);
      res.end();
    } catch (e) {
      if (e.message === 'notFound') {
        next(new AlbumsException(404, e.message));
      } else if (e.message === 'forbidden') {
        next(new AlbumsException(403, e.message));
      } else {
        next(new AlbumsException(500, e.message));
      }
    }
  }

  initializeRoutes() {
    this.router.use(`${this.path}`, authenticate());
    this.router.post(`${this.path}/`, validate(validation.createAlbum), this.createAlbum);
    this.router.get(`${this.path}/:id`, validate(validation.getOrDeleteAlbum), this.getAlbumDetails);
    this.router.get(`${this.path}`, this.getAllAlbums);
    this.router.put(`${this.path}/:id`, validate(validation.updateAlbum), this.updateAlbum);
    this.router.delete(`${this.path}/:id`, validate(validation.getOrDeleteAlbum), this.deleteAlbum);
  }
}

module.exports = Controller;
