import express from 'express';
import authRoutes from './auth.routes';
import exerciseRoutes from './exercise.routes';

const router = express.Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/exercises', exerciseRoutes);

export default router;
