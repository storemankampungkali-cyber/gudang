/**
 * ## server/src/routes/index.ts
 */

import { Router } from 'express';
import authRoutes from './authRoutes';
import inventoryRoutes from './inventoryRoutes';
import transactionRoutes from './transactionRoutes';
import warehouseRoutes from './warehouseRoutes';
import partnerRoutes from './partnerRoutes';
import rejectRoutes from './rejectRoutes';
import reportRoutes from './reportRoutes';
import dashboardRoutes from './dashboardRoutes';
import userRoutes from './userRoutes';
import { healthCheck } from '../config/database';

const router = Router();

router.get('/health', async (req, res) => {
  const status = await healthCheck();
  res.status(status.status === 'UP' ? 200 : 503).json({
    success: status.status === 'UP',
    ...status,
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/partners', partnerRoutes);
router.use('/reject', rejectRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);

export default router;
