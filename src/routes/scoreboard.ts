import { Router } from 'express';
import Player from '../model/player';
import Score from '../model/score';
import { ScoreboardService } from '../service/scoreboard';

export const createScoreboardRouter = (scoreboardService: ScoreboardService): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const season = req.query.season as string;
        if (!season) {
            throw new Error('Missing season in request');
        }

        const scoreboard: Player[] = await scoreboardService.getScoreboard(parseInt(season));

        res.json(scoreboard);
    });

    router.post('/', async (req, res) => {
        const score = req.body as Score;
        await scoreboardService.addScoreToScoreboard(score);
        res.sendStatus(201);
    });

    return router;
};
