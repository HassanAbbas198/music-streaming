const express = require('express');
const validate = require('express-validation');
const validation = require('./users.validation');
const UsersException = require('./users.exception');
const UsersService = require('./users.service');
const authenticate = require('../middleware/authenticate');

const usersService = new UsersService();

class Controller {
  constructor() {
    this.path = '/users';
    this.router = express.Router();
    this.initializeRoutes();
  }

  async register(req, res, next) {
    try {
      const result = await usersService.register(req.body);
      res.send(result);
    } catch (e) {
      if (e.message === 'userExists') {
        next(new UsersException(409, e.message));
      } else if (e.message === 'passwordsDontMatch') {
        next(new UsersException(400, e.message));
      } else {
        next(new UsersException(500, e.message));
      }
    }
  }

  async login(req, res, next) {
    try {
      const result = await usersService.login(req.body);
      res.send(result);
    } catch (e) {
      if (e.message === 'wrongCredentials') {
        next(new UsersException(401, e.message));
      } else if (e.message === 'locked' || e.message === 'emailSent' || e.message === 'unverified') {
        next(new UsersException(403, e.message));
      } else {
        next(new UsersException(500, e.message));
      }
    }
  }

  async verifyEmail(req, res, next) {
    try {
      await usersService.verifyEmail(req.body);
      res.end();
    } catch (e) {
      if (e.message === 'invalidToken') {
        next(new UsersException(401, e.message));
      } else {
        next(new UsersException(500, e.message));
      }
    }
  }

  async forgotPassword(req, res, next) {
    try {
      await usersService.forgotPassword(req.body);
      res.end();
    } catch (e) {
      next(new UsersException(500, e.message));
    }
  }

  async resetPassword(req, res, next) {
    try {
      await usersService.resetPassword(req.body);
      res.end();
    } catch (e) {
      if (e.message === 'invalidToken') {
        next(new UsersException(401, e.message));
      } else {
        next(new UsersException(500, e.message));
      }
    }
  }

  async createUser(req, res, next) {
    try {
      const result = await usersService.createUser(req.body);
      res.send(result);
    } catch (e) {
      if (e.message === 'userExists') {
        next(new UsersException(409, e.message));
      } else {
        next(new UsersException(500, e.message));
      }
    }
  }

  async logout(req, res, next) {
    try {
      await usersService.logout(req.user);
      res.end();
    } catch (e) {
      next(new UsersException(500, e.message));
    }
  }

  initializeRoutes() {
    // public routes
    this.router.post(`${this.path}/register`, validate(validation.register), this.register);
    this.router.post(`${this.path}/login`, validate(validation.login), this.login);
    this.router.post(`${this.path}/verify`, validate(validation.verifyEmail), this.verifyEmail);
    this.router.post(`${this.path}/forgotPassword`, validate(validation.forgotPassword), this.forgotPassword);
    this.router.post(`${this.path}/resetPassword`, validate(validation.resetPassword), this.resetPassword);
    // authenticated routes
    this.router.use(`${this.path}`, authenticate());
    this.router.use(`${this.path}/create`, validate(validation.createUser), this.createUser);
    this.router.use(`${this.path}/logout`, this.logout);
  }
}

module.exports = Controller;
