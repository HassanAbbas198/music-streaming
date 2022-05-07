const express = require('express');
const HttpException = require('../exceptions/httpException');

class Controller {
  constructor(health) {
    this.path = '/health';
    this.router = express.Router();
    this.health = health;
    this.initializeMiddleWare();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(this.path, this.getHealth);
  }

  initializeMiddleWare() {
    this.router.use((req, res, next) => {
      req.health = this.health;
      next();
    });
  }

  getHealth(req, res, next) {
    try {
      res.send(req.health.getStatus());
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  }
}

module.exports = Controller;
