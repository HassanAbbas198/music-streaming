const Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);

const options = {
  allowUnknownBody: false,
  allowUnknownParams: false,
  status: 400
};

const validation = {
  createAlbum: {
    options,
    body: {
      name: Joi.string().required(),
      cover: Joi.string().required(),
      artist: Joi.objectID().required()
    }
  },
  getOrDeleteAlbum: {
    options,
    params: {
      id: Joi.objectID().required()
    }
  },
  updateAlbum: {
    options,
    params: {
      id: Joi.objectID().required()
    },
    body: {
      name: Joi.string().optional(),
      cover: Joi.string().optional(),
      artist: Joi.objectID().optional()
    }
  }
};

module.exports = validation;
