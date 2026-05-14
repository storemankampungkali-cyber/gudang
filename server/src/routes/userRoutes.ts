/**
 * ## server/src/routes/userRoutes.ts
 */

import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createUserSchema, updateUserSchema } from '../validators/userValidator';

const router = Router();

// Semua route user butuh login & role ADMIN
router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', validate(createUserSchema), userController.createUser);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
