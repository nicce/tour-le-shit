import express from 'express';
import http from 'http';
import router from './api/routes';
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(router);

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('server is listening on 8080');
});
