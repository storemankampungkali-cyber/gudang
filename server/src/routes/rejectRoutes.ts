/**
 * ## server/src/routes/rejectRoutes.ts
 */

import { Router } from 'express';
import * as controller from '../controllers/rejectController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', controller.getRejects);
router.post('/', authorize('ADMIN', 'MANAGER', 'STAFF'), controller.createReject);
router.delete('/:id', authorize('ADMIN'), controller.deleteReject);

export default router;
