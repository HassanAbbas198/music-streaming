const express = require('express');
const validate = require('express-validation');
const validation = require('./user.validation');
const UserException = require('./user.exception');
const UserService = require('./user.service');
const authenticate = require('../middleware/authenticate');

const userService = new UserService();

class Controller {
  constructor() {
    this.path = '/users';
    this.router = express.Router();
    this.initializeRoutes();
  }

  async register(req, res, next) {
    try {
      const result = await userService.register(req.body);
      res.send(result);
    } catch (e) {
      if (e.message === 'userExists') {
        next(new UserException(409, e.message));
      } else if (e.message === 'passwordsDontMatch') {
        next(new UserException(400, e.message));
      } else {
        next(new UserException(500, e.message));
      }
    }
  }

  async login(req, res, next) {
    try {
      const result = await userService.login(req.body);
      res.send(result);
    } catch (e) {
      if (e.message === 'wrongCredentials') {
        next(new UserException(401, e.message));
      } else if (e.message === 'locked' || e.message === 'emailSent' || e.message === 'unverified') {
        next(new UserException(403, e.message));
      } else {
        next(new UserException(500, e.message));
      }
    }
  }

  async verifyEmail(req, res, next) {
    try {
      await userService.verifyEmail(req.body);
      res.end();
    } catch (e) {
      if (e.message === 'invalidToken') {
        next(new UserException(401, e.message));
      } else {
        next(new UserException(500, e.message));
      }
    }
  }

  async forgotPassword(req, res, next) {
    try {
      await userService.forgotPassword(req.body);
      res.end();
    } catch (e) {
      next(new UserException(500, e.message));
    }
  }

  async resetPassword(req, res, next) {
    try {
      await userService.resetPassword(req.body);
      res.end();
    } catch (e) {
      if (e.message === 'invalidToken') {
        next(new UserException(401, e.message));
      } else {
        next(new UserException(500, e.message));
      }
    }
  }

  async createUser(req, res, next) {
    try {
      const result = await userService.createUser(req.body);
      res.send(result);
    } catch (e) {
      if (e.message === 'userExists') {
        next(new UserException(409, e.message));
      } else {
        next(new UserException(500, e.message));
      }
    }
  }

  async logout(req, res, next) {
    try {
      await userService.logout(req.user);
      res.end();
    } catch (e) {
      next(new UserException(500, e.message));
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
