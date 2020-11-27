import express from 'express';
import scoreboard from './scoreboard';

const router = express.Router();
router.use('/scoreboard', scoreboard);

export default router;
