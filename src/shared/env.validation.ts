import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().required(),

  PORT: Joi.number().required(),

  DB_MONGO_URI: Joi.string().required(),
});
