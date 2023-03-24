module.exports = (app) => {
    app.get('/getPossibleMoves', (req, res) => {
        const {x, y} = req.body.coordinates;

        res.send(game.getPossibleMoves(req.body.coordinates));
    });
}