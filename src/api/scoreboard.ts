import express from 'express';
import Player from '../model/player';
import Score from '../model/score';
import { getScoreboard, addScoreToScoreboard } from '../service/scoreboard';

const router = express.Router();

router.get('/', async (_req, res) => {
    const scoreboard: Player[] = await getScoreboard();
    scoreboard.sort((a: Player, b: Player) => (b.points > a.points ? 1 : -1));
    res.json(scoreboard);
});

router.post('/', async (req, res) => {
    const score = req.body as Score;
    addScoreToScoreboard(score);
    res.sendStatus(201);
});

export default router;
