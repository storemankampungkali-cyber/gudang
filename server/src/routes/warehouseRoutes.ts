/**
 * ## server/src/routes/warehouseRoutes.ts
 */

import { Router } from 'express';
import * as controller from '../controllers/warehouseController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { warehouseSchema } from '../validators/warehouseValidator';

const router = Router();

router.use(authenticate);

router.get('/', controller.getWarehouses);
router.post('/', authorize('ADMIN'), validate(warehouseSchema), controller.createWarehouse);
router.put('/:id', authorize('ADMIN'), validate(warehouseSchema), controller.updateWarehouse);
router.delete('/:id', authorize('ADMIN'), controller.deleteWarehouse);

export default router;
