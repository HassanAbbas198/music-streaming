const Joi = require('joi');

const validation = {
  createUser: {
    options: {
      allowUnknownBody: false
    },
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
      dateOfBirth: Joi.string().required()
    }
  }
};

module.exports = validation;
