import express from 'express';
import {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
} from '../controllers/driver.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllDrivers);
router.get('/:id', getDriverById);

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, createDriver);
router.put('/:id', authenticateToken, requireAdmin, updateDriver);
router.delete('/:id', authenticateToken, requireAdmin, deleteDriver);

export default router;
