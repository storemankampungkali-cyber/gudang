/**
 * ## server/src/routes/reportRoutes.ts
 */

import { Router } from 'express';
import * as controller from '../controllers/reportController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'MANAGER'));

router.get('/stock-mutation', controller.stockMutation);
router.get('/stock-summary', controller.stockSummary);
router.get('/export/excel', controller.exportExcel);

export default router;
