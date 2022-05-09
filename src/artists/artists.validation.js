const Joi = require('joi');

const options = {
  allowUnknownBody: false,
  status: 400
};

const validation = {
  createArtist: {
    options,
    body: {
      name: Joi.string().required(),
      cover: Joi.string().required()
    }
  }
};

module.exports = validation;
