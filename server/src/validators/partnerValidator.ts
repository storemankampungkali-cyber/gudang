/**
 * ## server/src/validators/partnerValidator.ts
 */

import Joi from 'joi';

export const partnerSchema = Joi.object({
  type: Joi.string().valid('SUPPLIER', 'CUSTOMER').required(),
  name: Joi.string().max(100).required(),
  phone: Joi.string().max(20).allow('', null),
  email: Joi.string().email().max(100).allow('', null),
  address: Joi.string().allow('', null),
  npwp: Joi.string().max(50).allow('', null),
  is_active: Joi.boolean().default(true)
});
