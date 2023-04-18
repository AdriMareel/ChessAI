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
    });

	app.post('/evaluation', async (req, res) => {
		let score = await engine.evaluateBoard(engine.board, engine.turn);
		console.log("Score", score);
		res.send(score);
	});

	app.post('/isChecked', (req, res) => {
		const white = game.checkIfChecked(game.board, "white");
		const black = game.checkIfChecked(game.board, "black");

		res.send({white, black});
	});

	app.post('/playAI', async (req, res) => {
		let response = await engine.evaluateBoard(engine.board, engine.turn);

		let move = response.moves.uci[0];
		let start = move.substring(0,2);
		let end = move.substring(2);

		res.send({start : start, end : end});

		let { x : xStart, y : yStart} = game.chessCoordinateToXY(start);
		let { x : xEnd, y : yEnd} = game.chessCoordinateToXY(end);
		game.movePiece(xStart, yStart, xEnd, yEnd);
		game.updateHistory(game.board, game.board[yEnd][xEnd], xEnd, yEnd, xStart, yStart);
        engine.update(game.board, game.turn);
	});
}