import express from 'express';
import {
  getDriverStandings,
  getConstructorStandings,
  getRaceCalendar,
  getOverallStats,
  getRecentResults
} from '../controllers/stats.controller.js';

const router = express.Router();

// All stats routes are public
router.get('/drivers', getDriverStandings);
router.get('/constructors', getConstructorStandings);
router.get('/calendar', getRaceCalendar);
router.get('/overall', getOverallStats);
router.get('/recent', getRecentResults);

export default router;
