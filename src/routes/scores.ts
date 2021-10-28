import { Router } from 'express';
import Score from '../model/score';
import { ScoreboardService } from '../service/scoreboard';

export const createScoreRouter = (scoreboardService: ScoreboardService): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const name: string = req.query.name as string;
        const scores: Score[] = await scoreboardService.getScores(name);
        scores.sort((a: Score, b: Score) => {
            return b.date > a.date ? 1 : -1;
        });
        res.json(scores);
    });

    router.delete('/:id', async (req, res) => {
        const id = Number(req.params.id);
        await scoreboardService.deleteScore(id);
        res.sendStatus(201);
    });

    return router;
};
