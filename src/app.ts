import express from 'express';
import http from 'http';
import router from './api/routes';
import bodyParser from 'body-parser';
import * as path from 'path';
import config from './config';

const app = express();

app.use(bodyParser.json());
app.use(router);
console.log(config.env);
// Serve frontend
if (config.env === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../ui/build')));
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../ui/build', 'index.html'));
    });
}

const server = http.createServer(app);
server.listen(config.port, () => {
    console.log(`server is listening on ${config.port}`);
});
