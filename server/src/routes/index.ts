import express from 'express';
import authRoutes from './auth.routes';
import exerciseRoutes from './exercise.routes';
import programRoutes from './program.routes';

const router = express.Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/programs', programRoutes);

export default router;
