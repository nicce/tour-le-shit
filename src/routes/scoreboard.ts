import { Router } from 'express';
import Player from '../model/player';
import Score from '../model/score';
import { ScoreboardService } from '../service/scoreboard';

export const createScoreboardRouter = (scoreboardService: ScoreboardService): Router => {
    const router = Router();

    router.get('/', async (_req, res) => {
        const scoreboard: Player[] = await scoreboardService.getScoreboard();
        scoreboard.sort((a: Player, b: Player) => {
            if (b.lastPlayed === '' || b.lastPlayed === null) {
                return -1;
            }
            if (a.lastPlayed === '' || a.lastPlayed === null) {
                return 1;
            }
            return b.points > a.points ? 1 : -1;
        });
        res.json(scoreboard);
    });

    router.post('/', async (req, res) => {
        const score = req.body as Score;
        await scoreboardService.addScoreToScoreboard(score);
        res.sendStatus(201);
    });

    return router;
};
