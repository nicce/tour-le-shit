import express from 'express';
import http from 'http';
import router from './api/routes';

const app = express();

app.use(router);

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('server is listening on 8080');
});
