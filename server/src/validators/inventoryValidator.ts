/**
 * ## server/src/validators/inventoryValidator.ts
 */

import Joi from 'joi';

export const createItemSchema = Joi.object({
  code: Joi.string().alphanum().max(50).required(),
  name: Joi.string().max(150).required(),
  category: Joi.string().max(50).allow('', null),
  base_unit: Joi.string().max(20).required(),
  min_stock: Joi.number().integer().min(0).default(0),
  is_active: Joi.boolean().default(true),
  units: Joi.array().items(Joi.object({
    unit_name: Joi.string().max(20).required(),
    conversion_ratio: Joi.number().precision(4).positive().required(),
    operator: Joi.string().valid('*', '/').default('*')
  })).optional()
});

export const updateItemSchema = createItemSchema.fork(['code', 'name', 'base_unit'], (schema) => schema.optional());

export const createTransactionSchema = Joi.object({
  date: Joi.date().iso().required(),
  reference_no: Joi.string().max(50).required(),
  delivery_order_no: Joi.string().max(50).allow('', null),
  type: Joi.string().valid('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT').required(),
  source_warehouse_id: Joi.string().uuid().required(),
  target_warehouse_id: Joi.string().uuid().when('type', { is: 'TRANSFER', then: Joi.required(), otherwise: Joi.allow(null) }),
  partner_id: Joi.string().uuid().when('type', { is: Joi.valid('IN', 'OUT'), then: Joi.optional(), otherwise: Joi.allow(null) }),
  notes: Joi.string().allow('', null),
  items: Joi.array().items(Joi.object({
    item_id: Joi.string().uuid().required(),
    qty: Joi.number().positive().required(),
    unit: Joi.string().max(20).required(),
    conversion_ratio: Joi.number().default(1),
    note: Joi.string().max(255).allow('', null)
  })).min(1).required()
});
