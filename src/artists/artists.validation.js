const Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);

const options = {
  allowUnknownBody: false,
  allowUnknownParams: false,
  status: 400
};

const validation = {
  createArtist: {
    options,
    body: {
      name: Joi.string().required(),
      cover: Joi.string().required()
    }
  },
  getOrDeleteArtist: {
    options,
    params: {
      id: Joi.objectID().required()
    }
  },
  updateArtist: {
    options,
    params: {
      id: Joi.objectID().required()
    },
    body: {
      name: Joi.string().optional(),
      cover: Joi.string().optional()
    }
  }
};

module.exports = validation;
