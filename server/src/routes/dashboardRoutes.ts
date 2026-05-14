/**
 * ## server/src/routes/dashboardRoutes.ts
 */

import { Router } from 'express';
import * as controller from '../controllers/dashboardController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/summary', authenticate, controller.getSummary);

export default router;
