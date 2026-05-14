/**
 * ## server/src/routes/transactionRoutes.ts
 */

import { Router } from 'express';
import * as controller from '../controllers/transactionController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createTransactionSchema } from '../validators/inventoryValidator';

const router = Router();

router.use(authenticate);

router.get('/', controller.getTransactions);
router.get('/:id', controller.getTransactionDetail);
router.post('/', authorize('ADMIN', 'MANAGER', 'STAFF'), validate(createTransactionSchema), controller.createTransaction);
router.delete('/:id', authorize('ADMIN'), controller.deleteTransaction);

export default router;
