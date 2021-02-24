import express from 'express';
import Score from '../model/score';
import { getScores } from '../service/scoreboard';

const router = express.Router();

router.get('/', async (req, res) => {
    const name: string = req.query.name as string;
    const scores: Score[] = await getScores(name);
    scores.sort((a: Score, b: Score) => {
        return b.date > a.date ? 1 : -1;
    });
    res.json(scores);
});

export default router;
