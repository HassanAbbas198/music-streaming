const Joi = require('joi');

const options = {
  allowUnknownBody: false,
  status: 400
};

const validation = {
  createUser: {
    options,
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
      dateOfBirth: Joi.string().required()
    }
  },
  login: {
    options,
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  verifyEmail: {
    options,
    body: {
      token: Joi.string().required()
    }
  },
  resetPassword: {
    options,
    body: {
      token: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};

module.exports = validation;
