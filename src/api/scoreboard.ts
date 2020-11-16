import express from 'express';

const router = express.Router();

interface Scoreboard {
    name: string;
    points: number;
    lastPlayed: string;
}

const leaderboard: Scoreboard[] = [
    {
        name: 'Niclas',
        points: 231,
        lastPlayed: '2020-11-23',
    },
    {
        name: 'Marcus',
        points: 421,
        lastPlayed: '2020-11-23',
    },
    {
        name: 'Viktor',
        points: 321,
        lastPlayed: '2020-11-23',
    },
    {
        name: 'Alexander',
        points: 543,
        lastPlayed: '2020-11-23',
    },
    {
        name: 'Johan',
        points: 42,
        lastPlayed: '2020-07-14',
    },
];

router.get('/', async (_req, res) => {
    leaderboard.sort((a, b) => (b.points > a.points ? 1 : -1));
    res.json(leaderboard);
});

export default router;
