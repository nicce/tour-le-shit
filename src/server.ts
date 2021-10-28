import express, { Express } from 'express';
import bodyParser from 'body-parser';
import * as path from 'path';
import { ScoreboardService } from './service/scoreboard';
import { createScoreboardRouter } from './routes/scoreboard';
import { createScoreRouter } from './routes/scores';

export interface ServerOptions {
    env: string;
    scoreboardService: ScoreboardService;
}

export const createServer = (servierOptions: ServerOptions): Express => {
    const app = express();
    app.use(bodyParser.json());
    app.use('/scoreboard', createScoreboardRouter(servierOptions.scoreboardService));
    app.use('/score', createScoreRouter(servierOptions.scoreboardService));

    // Serve frontend
    if (servierOptions.env === 'production') {
        // Serve any static files
        app.use(express.static(path.join(__dirname, '../ui/build')));
        // Handle React routing, return all requests to React app
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../ui/build', 'index.html'));
        });
    }

    return app;
};
