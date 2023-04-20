module.exports = (app, game, engine) => {
    app.post('/getPossibleMoves', (req, res) => {
        const {x, y} = req.body;

        res.send(game.getPossibleMoves(game.board, game.board[y][x]));
    });

    app.post('/movePiece', async (req, res) => {
        const {x, y, xNext, yNext} = req.body;
        game.movePiece(x, y, xNext, yNext);
        const history = await game.updateHistory(game.board, game.board[yNext][xNext], xNext, yNext, x, y);
		res.send({history});
		engine.update(game.board, game.turn);
    });

    app.post('/promotion', (req, res) => {
        const {promotion, x, y} = req.body;
        
        res.send(game.promotion(promotion, x, y));
        console.log("promotion time", promotion, x, y)
        
    });

	app.post('/evaluation', async (req, res) => {
		let score = await engine.evaluateBoard(engine.board, engine.turn);
		res.send(score);
	});

	app.post('/isChecked', (req, res) => {
		const white = game.checkIfChecked(game.board, "white");
		const black = game.checkIfChecked(game.board, "black");

		res.send({white, black});
	});

	app.post('/playAI', async (req, res) => {
		let {start : start , end : end} = await engine.playAI();

		let { x : xStart, y : yStart} = game.chessCoordinateToXY(start);
		let { x : xEnd, y : yEnd} = game.chessCoordinateToXY(end);

		let object = engine.checkIfCastling(xStart, yStart, xEnd, yEnd);
		if (object){
			res.send({start : start, end : end, castling : object});
		}
		else{
			res.send({start : start, end : end});
		}
		game.movePiece(xStart, yStart, xEnd, yEnd);
		game.updateHistory(game.board, game.board[yEnd][xEnd], xEnd, yEnd, xStart, yStart);
        engine.update(game.board, game.turn);
	});

    app.post('/getFen', (req, res) => {
        const {x, y} = req.body;

        res.send({fen: engine.getFen(engine.board,engine.turn)});
    });

    app.post('/getApiKey', (req, res) => {
        res.send({apiKey: process.env.GPT_API_KEY});
    });

	app.post('/checkmate', (req, res) => {
		res.send(game.checkMate(game.board, game.turn));
	});

	app.post('/stalemate', (req, res) => {
		res.send(game.checkMate(game.board, game.turn));
	});

	app.post('/getHistory', async (req, res) => {
		res.send({history : game.moveHistory});
	});
}