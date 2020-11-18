import express from 'express';
import * as fs from "fs";
import * as path from "path";

const router = express.Router();
const fileName = path.join(__dirname, 'data/scoreboard.json');

interface Player {
    name: string;
    points: number;
    lastPlayed: string;
    holderOfSnek: boolean;
}

router.get('/', async (_req, res) => {
    const data: Buffer = fs.readFileSync(fileName);
    const scoreboard = JSON.parse(data.toString('utf-8'));
    scoreboard.sort((a: Player, b: Player) => (b.points > a.points ? 1 : -1));
    res.json(scoreboard);
});

export default router;
