import express from 'express';
import {
  getAllCircuits,
  getCircuitById,
  createCircuit,
  updateCircuit,
  deleteCircuit
} from '../controllers/circuit.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCircuits);
router.get('/:id', getCircuitById);

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, createCircuit);
router.put('/:id', authenticateToken, requireAdmin, updateCircuit);
router.delete('/:id', authenticateToken, requireAdmin, deleteCircuit);

export default router;
