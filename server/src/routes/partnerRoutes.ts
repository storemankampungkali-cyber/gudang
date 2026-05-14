/**
 * ## server/src/routes/partnerRoutes.ts
 */

import { Router } from 'express';
import * as controller from '../controllers/partnerController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { partnerSchema } from '../validators/partnerValidator';

const router = Router();

router.use(authenticate);

router.get('/', controller.getPartners);
router.post('/', authorize('ADMIN', 'MANAGER'), validate(partnerSchema), controller.createPartner);
router.put('/:id', authorize('ADMIN', 'MANAGER'), validate(partnerSchema), controller.updatePartner);
router.delete('/:id', authorize('ADMIN'), controller.deletePartner);

export default router;
