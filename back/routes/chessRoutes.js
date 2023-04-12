module.exports = (app, game, engine) => {
    app.post('/getPossibleMoves', (req, res) => {
        const {x, y} = req.body;

        res.send(game.getPossibleMoves(game.board, game.board[y][x]));
    });

    app.post('/movePiece', (req, res) => {
        const {x, y, xNext, yNext} = req.body;
        res.send(game.movePiece(x, y, xNext, yNext));
        res.send(game.updateHistory(game.board, game.board[yNext][xNext], xNext, yNext, x, y));
        res.send(game.displayHistory());
	    engine.update(game.board, game.turn);
    });

	app.post('/isChecked', (req, res) => {
		const white = game.checkIfChecked(game.board, "white");
		const black = game.checkIfChecked(game.board, "black");

		res.send({white, black});
	});
}