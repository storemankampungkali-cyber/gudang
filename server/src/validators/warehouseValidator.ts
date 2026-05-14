/**
 * ## server/src/validators/warehouseValidator.ts
 */

import Joi from 'joi';

export const warehouseSchema = Joi.object({
  name: Joi.string().max(100).required(),
  location: Joi.string().allow('', null),
  pic: Joi.string().max(100).allow('', null),
  phone: Joi.string().max(20).allow('', null),
  is_active: Joi.boolean().default(true)
});
