import express from 'express';
import {
  getAllResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult
} from '../controllers/result.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllResults);
router.get('/:id', getResultById);

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, createResult);
router.put('/:id', authenticateToken, requireAdmin, updateResult);
router.delete('/:id', authenticateToken, requireAdmin, deleteResult);

export default router;
