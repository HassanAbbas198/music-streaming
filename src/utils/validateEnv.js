const joi = require('joi');

const envSchema = joi.object({
  APP_PORT: joi.number().integer().required().greater(999),
  DB_DATABASE: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().integer().optional(),
  DB_USER: joi.string().required().allow(''),
  DB_PASSWORD: joi.string().required().allow('')
}).unknown(true);

const { error } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Process env validation error: ${error.message}`);
}
