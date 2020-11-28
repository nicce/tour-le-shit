import express from 'express';
import http from 'http';
import router from './api/routes';
import bodyParser from 'body-parser';
import * as path from 'path';

const app = express();

app.use(bodyParser.json());
app.use(router);

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../ui/build')));
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../ui/build', 'index.html'));
    });
}

const server = http.createServer(app);
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`server is listening on ${port}`);
});
