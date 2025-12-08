import express from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from '../controllers/team.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTeams);
router.get('/:id', getTeamById);

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, createTeam);
router.put('/:id', authenticateToken, requireAdmin, updateTeam);
router.delete('/:id', authenticateToken, requireAdmin, deleteTeam);

export default router;
