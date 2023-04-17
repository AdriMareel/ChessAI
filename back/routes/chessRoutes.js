module.exports = (app, game, engine) => {
    app.post('/getPossibleMoves', (req, res) => {
        const {x, y} = req.body;

        res.send(game.getPossibleMoves(game.board, game.board[y][x]));
    });

    app.post('/movePiece', (req, res) => {
        const {x, y, xNext, yNext} = req.body;
        res.send(game.movePiece(x, y, xNext, yNext));
        game.updateHistory(game.board, game.board[yNext][xNext], xNext, yNext, x, y);
        engine.update(game.board, game.turn);
		engine.evaluateBoard(engine.board, engine.turn);

    });

	app.post('/evaluation', async (req, res) => {
		const value = await engine.evaluateBoard(engine.board, engine.turn)
		console.log("---valeur--- : ",value)
		res.send({value});
	});

	app.post('/engine', (req, res) => {
		res.send(engine.evaluateBoard(engine.board, engine.turn));
	});

	app.post('/isChecked', (req, res) => {
		const white = game.checkIfChecked(game.board, "white");
		const black = game.checkIfChecked(game.board, "black");

		res.send({white, black});
	});
}