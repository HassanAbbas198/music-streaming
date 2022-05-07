const express = require('express');
const validate = require('express-validation');
const validation = require('./user.validation');
const UserException = require('./user.exception');
const UserService = require('./user.service');

const userService = new UserService();

class Controller {
  constructor() {
    this.path = '/users';
    this.router = express.Router();
    this.initializeRoutes();
  }

  async createUser(req, res, next) {
    try {
      const result = await userService.createUser(req.body);
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

  initializeRoutes() {
    this.router.post(`${this.path}/register`, validate(validation.createUser), this.createUser);
  }
}

module.exports = Controller;
