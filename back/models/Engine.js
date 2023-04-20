const Piece = require("./Piece");
const Game = require("./Chess");
const fetch = require("node-fetch");
const {chessAnalysisApi, PROVIDERS} = require("chess-analysis-api");

module.exports = class Engine extends Game {
	constructor() {
		super();
		this.movesNumber = 0;
	}

	update(board, turn) {
		this.board = board;
		this.turn = turn;
		this.movesNumber++;
	}

	minimax(board, depth, alpha, beta, maximizingPlayer, movesPlayed) {
		if (depth === 0 || this.isGameOver(board)) {
			return { score: this.evaluateBoard(board, maximizingPlayer ? "white" : "black"), moves: movesPlayed };
		}
	
		const moves = this.getAllPossibleMoves(board, maximizingPlayer ? "white" : "black");
		if (maximizingPlayer) {
			let maxEval = -Infinity;
			let bestMoves = [];
			for (const move of moves) {
				const newBoard = this.simulateMove(move, board);
				const { score, moves: nextMoves } = this.minimax(newBoard, depth - 1, alpha, beta, false, [...movesPlayed, move]);
				if (score > maxEval) {
					maxEval = score;
					bestMoves = [move, ...nextMoves];
				}
				alpha = Math.max(alpha, score);
				if (beta <= alpha) {
					break;
				}
			}
			return { score: maxEval, moves: bestMoves };
		} else {
			let minEval = Infinity;
			let bestMoves = [];
			for (const move of moves) {
				const newBoard = this.simulateMove(move, board);
				const { score, moves: nextMoves } = this.minimax(newBoard, depth - 1, alpha, beta, true, [...movesPlayed, move]);
				if (score < minEval) {
					minEval = score;
					bestMoves = [move, ...nextMoves];
				}
				beta = Math.min(beta, score);
				if (beta <= alpha) {
					break;
				}
			}
			return { score: minEval, moves: bestMoves };
		}
	}

	displayBoardConsole(board) {
		for (let i = 0; i < board.length; i++) {
			let row = "";
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j] === null) {
					row += "- ";
				} else {
					if (board[i][j].type == "knight"){
						let letter = board[i][j].type[1];
						if (board[i][j].color == "white") {
							letter = letter.toUpperCase();
						}
						row += letter + " ";
					}
					else {
						let letter = board[i][j].type[0];
						if (board[i][j].color == "white") {
							letter = letter.toUpperCase();
						}
						row += letter + " ";
					}
				}
			}
			console.log(row);
		}
	}

	simulateMove(action, board) {
		const piece = action.piece;
		const move = action.move;

		console.log("SIMULATE MOVE", action);

		let pieceX;
		let pieceY;

		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j] === piece) {
					pieceX = j;
					pieceY = i;
				}
			}
		}

		// Faire une copie du plateau
		let newBoard = board.map(row => row.slice());

		newBoard[move.y][move.x] = newBoard[pieceY][pieceX];
		newBoard[pieceY][pieceX] = null;
		newBoard[move.y][move.x].moved = true;

		this.changeTurn();

		return newBoard;
	}

	async evaluateBoard(board, color) {
		return new Promise(async (resolve, reject) => {

			let score = 0;
			let fen = this.getFen(board, color);
			console.log("FEN", fen);

			await chessAnalysisApi.getAnalysis({
				fen: fen,
				type : "evaluation",
				depth: 10,
				multipv: 6,
				excludes: [
					PROVIDERS.LICHESS_BOOK,
					PROVIDERS.LICHESS_CLOUD_EVAL,
				]
				})
				.then((result) => {
					
					console.log(result.moves);
					//check if there's a forced mate
					let mate = false;
					result.moves.forEach(move => {
						if (move.score.type == "mate"){
							score = move.score;

							// if the color is black, the score is negative
							if (this.movesNumber % 2 == 1){
								score *= -1;
							}
							console.log({score : score, moves : move.uci});
							resolve({score : score, moves : move.uci});
						}
					});
					
					if (!mate){
						if(result.moves.length >= 2){
							if ((result.moves[0].score.value - 100) > result.moves[1].score.value ){
								let score = result.moves[0].score.value;
								
								if (this.movesNumber % 2 == 1){
									score *= -1;
								}
								resolve({score : (score/100).toFixed(2), moves : result.moves[0].uci});
							}
						}
					}

					// calculate the average score
					result.moves.forEach(move => {
						score += move.score.value;
					});
					score /= result.moves.length;
					;
					
					// if the color is black, the score is negative
					if (this.movesNumber % 2 == 1){
						score *= -1;
					}
					
					resolve({score : (score/100).toFixed(2), moves : result.moves[0].uci});
				})
				.catch(error => {
					console.error(error);
					throw new Error(error.message);
			});
		});
	}

	getFen(board, color) {
		let boardCopy = board.map(row => row.map(piece => piece));

		// change the array to a fen string
		let pieceTypes = ["pawn", "knight", "bishop", "rook", "queen", "king"];
		let fenChar = ["p", "n", "b", "r", "q", "k", "P", "N", "B", "R", "Q", "K"];

		let fen = "";
		let empty = 0;
		for (let i = boardCopy.length - 1 ; i >= 0; i--) {
			for (let j = 0; j < boardCopy.length; j++) {
				if (boardCopy[i][j] === null) {
					empty++;
				} else {
					if (empty > 0) {
						fen += empty;
						empty = 0;
					}
					for (let k = 0; k < pieceTypes.length; k++) {
						if (boardCopy[i][j].type === pieceTypes[k]) {
							if (boardCopy[i][j].color === "white") {
								fen += fenChar[k + 6];
							} else {
								fen += fenChar[k];
							}
						}
					}
				}
			}
			if (empty > 0) {
				fen += empty;
				empty = 0;
			}
			if (i > 0) {
				fen += "/";
			}
		}
		// color 
		color === "white" ? fen += " w " : fen += " b ";

		// castling possible
		let castling = "";
		castling += this.checkCastling(boardCopy);

		//en passant + halfmove + fullmove
		let enPassant = "-";
		fen += castling + " " + enPassant + " 0 " + Math.floor(this.movesNumber / 2 + 1)   ;
		
		return fen;
	}

	async playAI(){
		let response = await this.evaluateBoard(this.board, this.turn);
		console.log("RESPONSE", response);
		let move = response.moves[0];
		let start = move.substring(0,2);
		let end = move.substring(2);

		return {start : start, end : end};
	}

	checkIfCastling(xStart,yStart,xEnd,yEnd){
		if (this.board[yStart][xStart].type == "king" && Math.abs(xEnd - xStart) == 2){
			//return the coordinate of the rook
			if (xEnd > xStart){
				return {startR : this.xyToChessCoordinate({x : 7, y : yStart}), endR : this.xyToChessCoordinate({x : 5, y : yStart})};
			} else {
				return {startR : this.xyToChessCoordinate({x : 0, y : yStart}), endR : this.xyToChessCoordinate({x : 3, y : yStart})};
			}
		}
		return false;
	}

	getAllPossibleMoves(board, color){
		let possibleMoves = [];

		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				const piece = board[y][x];
				if (piece && piece.color === color) {
					possibleMoves.push({piece : piece, move : this.getPossibleMoves(board, piece)});
				}
			}
		}
		possibleMoves.flat();
		possibleMoves = possibleMoves.filter((action) => action.move.length > 0);
		possibleMoves = possibleMoves.map(({ piece, move }) => ({ piece, move: move[0] }));

		return possibleMoves;
	}


	isGameOver(board){
		let whitePossibleMoves = this.getAllPossibleMoves(board, "white");
		let blackPossibleMoves = this.getAllPossibleMoves(board, "black");

		if (this.checkIfChecked(this.board, "white") && whitePossibleMoves.length === 0) {
			console.log("------------GAME IS OVER------------");
			return true;
		}

		if (this.checkIfChecked(this.board, "black") && blackPossibleMoves.length === 0) {
			console.log("------------GAME IS OVER------------");
			return true;
		}

		return false;
	}

	checkCastling(board) {
		let castling = "";
		let whiteCastleQueenSide = true;
		let whiteCastleKingSide = true;
		let blackCastleQueenSide = true;
		let blackCastleKingSide = true;

		if (board[0][4] !== null){
			if (board[0][4].type != "king" || board[0][4].moved) {
				whiteCastleKingSide = false;
				whiteCastleQueenSide = false;
			}
		}
		else {
			whiteCastleKingSide = false;
			whiteCastleQueenSide = false;
		}
		if (board[7][4] !== null){
			if (board[7][4].type != "king" || board[7][4].moved) {
				blackCastleKingSide = false;
				blackCastleQueenSide = false;
			}
		}
		else{
			blackCastleKingSide = false;
			blackCastleQueenSide = false;
		}
		if (board[0][0] !== null){
			if (board[0][0].type != "rook" || board[0][0].moved) {
				whiteCastleQueenSide = false;
			}
		}
		else{
			whiteCastleQueenSide = false;
		}
		if (board[0][7] !== null){
			if (board[0][7].type != "rook" || board[0][7].moved) {
				whiteCastleKingSide = false;
			}
		}
		else{
			whiteCastleKingSide = false;
		}
		if (board[7][0] !== null){
			if (board[7][0].type != "rook" || board[7][0].moved) {
				blackCastleQueenSide = false;
			}
		}
		else{
			blackCastleQueenSide = false;
		}
		if (board[7][7] !== null){
			if (board[7][7].type != "rook" || board[7][7].moved) {
				blackCastleKingSide = false;
			}
		}
		else{
			blackCastleKingSide = false;
		}

		
		if (whiteCastleKingSide) {
			if (this.checkIfSquareIsUnderAttack(board, 5, 0, "black") || this.checkIfSquareIsUnderAttack(board, 6, 0, "black")) {
				whiteCastleKingSide = false;
			}
		}

		if (whiteCastleQueenSide) {
			if (this.checkIfSquareIsUnderAttack(board, 3, 0, "black") || this.checkIfSquareIsUnderAttack(board, 2, 0, "black") || this.checkIfSquareIsUnderAttack(board, 1, 0, "black")) {
				whiteCastleQueenSide = false;
			}
		}

		if (blackCastleKingSide) {
			if (this.checkIfSquareIsUnderAttack(board, 5, 7, "white") || this.checkIfSquareIsUnderAttack(board, 6, 7, "white")) {
				blackCastleKingSide = false;
			}
		}

		if (blackCastleQueenSide) {
			if (this.checkIfSquareIsUnderAttack(board, 3, 7, "white") || this.checkIfSquareIsUnderAttack(board, 2, 7, "white") || this.checkIfSquareIsUnderAttack(board, 1, 7, "white")) {
				blackCastleQueenSide = false;
			}
		}

		if (whiteCastleKingSide) {
			castling += "K";
		}
		if (whiteCastleQueenSide) {
			castling += "Q";
		}
		if (blackCastleKingSide) {
			castling += "k";
		}
		if (blackCastleQueenSide) {
			castling += "q";
		}

		if (castling === "") {
			castling = "-";
		}

		return castling;
	}
}