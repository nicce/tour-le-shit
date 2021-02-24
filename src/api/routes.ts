import express from 'express';
import scoreboard from './scoreboard';
import scores from './scores';

const router = express.Router();
router.use('/scoreboard', scoreboard);
router.use('/score', scores);

export default router;
