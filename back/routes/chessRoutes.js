module.exports = (app, game) => {
    app.post('/getPossibleMoves', (req, res) => {
        const {x, y} = req.body;

        res.send(game.getPossibleMoves(game.board[y][x]));
    });

    app.post('/movePiece', (req, res) => {
        const {x, y, newX, newY} = req.body;

        res.send(game.movePiece(x, y, newX, newY));
    });
}