const express = require('express');
const validate = require('express-validation');
const validation = require('./tracks.validation');
const TracksException = require('./tracks.exception');
const TracksService = require('./tracks.service');
const authenticate = require('../middleware/authenticate');
const GlobalService = require('../utils/globalService');

const tracksService = new TracksService();
const globalService = new GlobalService();

class Controller {
  constructor() {
    this.path = '/tracks';
    this.router = express.Router();
    this.initializeRoutes();
  }

  async createTrack(req, res, next) {
    try {
      const result = await tracksService.createTrack(req.body, req.user);
      res.locals.result = result;
      next();
    } catch (e) {
      next(new TracksException(500, e.message));
    }
  }

  async getAllTracks(req, res, next) {
    try {
      const result = await tracksService.getAllTracks();
      res.locals.result = result;
      next();
    } catch (e) {
      next(new TracksException(500, e.message));
    }
  }

  async getTrackDetails(req, res, next) {
    try {
      const result = await tracksService.getTrackDetails(req.params);
      res.locals.result = result;
      next();
    } catch (e) {
      if (e.message === 'notFound') {
        next(new TracksException(404, e.message));
      } else {
        next(new TracksException(500, e.message));
      }
    }
  }

  async updateTrack(req, res, next) {
    try {
      await tracksService.updateTrack(req.body, req.params, req.user);
      next();
    } catch (e) {
      if (e.message === 'notFound') {
        next(new TracksException(404, e.message));
      } else if (e.message === 'forbidden') {
        next(new TracksException(403, e.message));
      } else {
        next(new TracksException(500, e.message));
      }
    }
  }

  async deleteTrack(req, res, next) {
    try {
      await tracksService.deleteTrack(req.params, req.user);
      next();
    } catch (e) {
      if (e.message === 'notFound') {
        next(new TracksException(404, e.message));
      } else if (e.message === 'forbidden') {
        next(new TracksException(403, e.message));
      } else {
        next(new TracksException(500, e.message));
      }
    }
  }

  initializeRoutes() {
    this.router.use(`${this.path}`, authenticate());
    this.router.post(`${this.path}/`, validate(validation.createTrack), this.createTrack);
    this.router.get(`${this.path}/:id`, validate(validation.getOrDeleteTrack), this.getTrackDetails);
    this.router.get(`${this.path}`, this.getAllTracks);
    this.router.put(`${this.path}/:id`, validate(validation.updateTrack), this.updateTrack);
    this.router.delete(`${this.path}/:id`, validate(validation.getOrDeleteTrack), this.deleteTrack);
    this.router.use(`${this.path}`, globalService.returnSuccess);
  }
}

module.exports = Controller;
