const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const setupChessRoutes = require('./back/routes/chessRoutes');
const Game = require('./back/models/Chess');
const { resetGame } = require('./back/middleware/resetGame');
const Engine = require('./back/models/Engine');

const app = express();
const port = 3000;

let game = new Game();
let engine = new Engine(game.board, game.turn);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'front')));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front/menu.html');
});

app.get('/game', (req, res, next) => {
    req.game = game;
    next();
}, resetGame, (req, res) => {
    res.sendFile(__dirname + '/front/chessBoard.html');
});

setupChessRoutes(app, game, engine);