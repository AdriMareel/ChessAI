module.exports = (app, game) => {
    app.post('/getPossibleMoves', (req, res) => {
        const {x, y} = req.body;

        res.send(game.getPossibleMoves(game.board[y][x]));
    });

    app.post('/movePiece', (req, res) => {
        const {x, y, xNext, yNext} = req.body;

        res.send(game.movePiece(x, y, xNext, yNext));
    });

	app.post('/isChecked', (req, res) => {
		const white = game.checkIfChecked(game.board, "white");
		const black = game.checkIfChecked(game.board, "black");

		res.send({white, black});
	});
}