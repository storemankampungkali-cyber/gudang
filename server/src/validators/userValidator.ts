/**
 * ## server/src/validators/userValidator.ts
 */

import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().max(100).required(),
  role: Joi.string().valid('ADMIN', 'MANAGER', 'STAFF').default('STAFF'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE')
});

export const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50),
  password: Joi.string().min(6),
  full_name: Joi.string().max(100),
  role: Joi.string().valid('ADMIN', 'MANAGER', 'STAFF'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE')
});
