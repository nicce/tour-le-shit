import express from 'express';
import * as fs from "fs";
import * as path from "path";

const router = express.Router();
const scoreboardFileName = path.join(__dirname, '../../../scoreboard.json');

interface Player {
    name: string;
    points: number;
    lastPlayed: string;
    holderOfSnek: boolean;
}

interface Score {
    name: string;
    points: number;
    holderOfSnek: boolean;
    nettoTweets: number;
    muligans: number;
}

router.get('/', async (_req, res) => {
    const data: Buffer = fs.readFileSync(scoreboardFileName);
    const scoreboard: Player[] = JSON.parse(data.toString('utf-8'));
    scoreboard.sort((a: Player, b: Player) => (b.points > a.points ? 1 : -1));
    res.json(scoreboard);
});

router.post('/', async (req, res) => {
    const score = req.body as Score;

    // fetch current scoreboard
    const data: Buffer = fs.readFileSync(scoreboardFileName);
    const scoreboard: Player[] = JSON.parse(data.toString('utf-8'));

    // calculate new score for the affected players
    scoreboard.forEach((player, i) => {
        if(player.name === score.name) {
            scoreboard[i] = calculateScore(score, player);
        }
    });

    // store new scoreboard
    const fileContent = JSON.stringify(scoreboard);
    fs.writeFileSync(scoreboardFileName, fileContent);
    res.sendStatus(201);
});

function calculateScore(score: Score, player: Player): Player {
    const basePoint = score.points - 36 < 30 ? 30 : score.points - 36;
    const tweetPoints = 2 * score.nettoTweets;
    const scorePoint = basePoint + tweetPoints - score.muligans;

    player.points += scorePoint;
    player.lastPlayed = new Date().toISOString().split('T')[0];
    player.holderOfSnek = score.holderOfSnek;

    return player;
}

export default router;
