const Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);

const options = {
  allowUnknownBody: false,
  allowUnknownParams: false,
  status: 400
};

const validation = {
  createTrack: {
    options,
    body: {
      name: Joi.string().required(),
      cover: Joi.string().required(),
      album: Joi.objectID().optional()
    }
  },
  getOrDeleteTrack: {
    options,
    params: {
      id: Joi.objectID().required()
    }
  },
  updateTrack: {
    options,
    params: {
      id: Joi.objectID().required()
    },
    body: {
      name: Joi.string().optional(),
      cover: Joi.string().optional(),
      album: Joi.objectID().optional()
    }
  }
};

module.exports = validation;
