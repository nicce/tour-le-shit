import config from './config';
import { createServer } from './server';
import { Client } from 'pg';
import { ScoreboardService } from './service/scoreboard';
import { ScoreboardRepository } from './db/db';

const main = () => {
    let client: Client;
    if (config.env !== 'production') {
        client = new Client({
            host: config.db.host,
            port: 5432,
            user: config.db.user,
            password: config.db.password,
            database: 'tourleshit',
        });
    } else {
        client = new Client({
            connectionString: config.db.host,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }

    const scoreboardService = new ScoreboardService(new ScoreboardRepository(client));

    const app = createServer({ env: config.env, scoreboardService: scoreboardService });
    return app.listen(config.port);
};

main();
