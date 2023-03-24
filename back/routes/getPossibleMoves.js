module.exports = (app, game) => {
    app.post('/getPossibleMoves', (req, res) => {
        const {x, y} = req.body;

        res.send(game.getPossibleMoves(game.board[y][x]));
    });
}