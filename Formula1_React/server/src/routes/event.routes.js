import express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventTypes,
  getSeasons
} from '../controllers/event.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/types', getEventTypes);
router.get('/seasons', getSeasons);
router.get('/:id', getEventById);

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, createEvent);
router.put('/:id', authenticateToken, requireAdmin, updateEvent);
router.delete('/:id', authenticateToken, requireAdmin, deleteEvent);

export default router;
