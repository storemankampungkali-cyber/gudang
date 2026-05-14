/**
 * ## server/src/routes/inventoryRoutes.ts
 */

import { Router } from 'express';
import * as controller from '../controllers/inventoryController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createItemSchema, updateItemSchema } from '../validators/inventoryValidator';

const router = Router();

router.use(authenticate);

router.get('/', controller.getInventory);
router.get('/items', controller.getItems);
router.get('/low-stock', controller.getLowStock);

router.post('/items', authorize('ADMIN', 'MANAGER'), validate(createItemSchema), controller.createItem);
router.post('/bulk-import', authorize('ADMIN', 'MANAGER'), controller.bulkImport);
router.put('/items/:id', authorize('ADMIN', 'MANAGER'), validate(updateItemSchema), controller.updateItem);
router.delete('/items/:id', authorize('ADMIN'), controller.deleteItem);

export default router;
