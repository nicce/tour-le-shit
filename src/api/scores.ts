import express from 'express';
import Score from '../model/score';
import { getScores, deleteScore } from '../service/scoreboard';

const router = express.Router();

router.get('/', async (req, res) => {
    const name: string = req.query.name as string;
    const scores: Score[] = await getScores(name);
    scores.sort((a: Score, b: Score) => {
        return b.date > a.date ? 1 : -1;
    });
    res.json(scores);
});

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    await deleteScore(id);
    res.sendStatus(201);
});

export default router;
