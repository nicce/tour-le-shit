import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

import Player from '../model/player';
import Score from '../model/score';

dotenv.config({ path: path.join(__dirname, '../../.env') });

let client: Client;
if (process.env.NODE_ENV !== 'production') {
    client = new Client({
        host: process.env.DATABASE_URL,
        port: 5432,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'tourleshit',
    });
} else {
    client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}
client.connect();

export async function fetchScoreboard(): Promise<Player[]> {
    const qry = 'SELECT * from scoreboard';
    const res = await query(qry, []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.rows.map((row: any) => {
        return {
            name: row.name,
            points: row.points,
            holderOfSnek: row.holderofsnek,
            lastPlayed: row.lastplayed,
        };
    });
}

export async function findScores(name: string): Promise<Score[]> {
    const qry = 'SELECT * from score where name=$1';
    const values = [name];
    const res = await query(qry, values);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.rows.map((row: any) => {
        return {
            name: row.name,
            points: row.points,
            holderOfSnek: row.holderofsnek,
            nettoTweets: row.nettotweets,
            nettoEagles: row.nettoeagles,
            muligans: row.muligans,
            date: row.date,
        };
    });
}

export async function findPlayer(name: string): Promise<Player> {
    const qry = 'SELECT * from scoreboard where name=$1';
    const values = [name];
    const res = await query(qry, values);
    // Should only be one hit
    const data = res.rows[0];
    return {
        points: data.points,
        holderOfSnek: data.holderOfSnek,
        lastPlayed: data.lastPlayed,
        name: data.name,
    };
}

export async function addScore(score: Score): Promise<void> {
    const qry =
        'INSERT INTO score(name, points, holderOfSnek, nettoTweets, nettoEagles, muligans, date) VALUES($1, $2, $3, $4, $5, $6, $7)';
    const values = [
        score.name,
        score.points,
        score.holderOfSnek,
        score.nettoTweets,
        score.nettoEagles,
        score.muligans,
        new Date().toISOString().split('T')[0],
    ];

    await query(qry, values);
    await updateScoreboard(score);
}

export async function updateScoreboard(score: Score): Promise<void> {
    const player = await findPlayer(score.name);
    const updatedPlayer = updatePlayerScore(score, player);
    const qry = 'UPDATE scoreboard set points=$1, holderOfSnek=$2, lastPlayed=$3 where name=$4';
    const values = [updatedPlayer.points, updatedPlayer.holderOfSnek, updatedPlayer.lastPlayed, updatedPlayer.name];
    await query(qry, values);
    if (score.holderOfSnek) {
        await updateSnekHolder(score.name);
    }
}

async function updateSnekHolder(newSnekHolder: string) {
    const qry = 'UPDATE scoreboard set holderOfSnek=false where name !=$1';
    const values = [newSnekHolder];
    await query(qry, values);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function query(qry: string, values: any[]): Promise<any> {
    try {
        return await client.query(qry, values);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

function updatePlayerScore(score: Score, player: Player): Player {
    const scorePoint = calculatePoints(score.points, score.nettoTweets, score.nettoEagles, score.muligans);
    player.points += scorePoint;
    player.lastPlayed = new Date().toISOString().split('T')[0];
    player.holderOfSnek = score.holderOfSnek;

    return player;
}

export function calculatePoints(
    stablePoints: number,
    nettoTweets: number,
    nettoEagles: number,
    muligans: number,
): number {
    let basePoint = stablePoints < 30 ? 30 - 36 : stablePoints - 36;
    if (basePoint > 0) {
        basePoint = basePoint * 2;
    }
    const tweetPoints = 2 * nettoTweets;
    const eaglePoints = 3 * nettoEagles;
    const muliganPoints = 2 * muligans;
    return basePoint + tweetPoints + eaglePoints - muliganPoints;
}
