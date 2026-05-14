/**
 * ## server/src/validators/authValidator.ts
 */

import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username wajib diisi'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password wajib diisi'
  })
});
