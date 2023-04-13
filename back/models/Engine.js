const Piece = require("./Piece");
const Game = require("./Chess");
const fetch = require("node-fetch");

module.exports = class Engine extends Game {
	constructor() {
		super();
		this.evaluateBoard(this.board, this.turn);
		// let { score, moves } = this.minimax(this.board, 5, -Infinity, Infinity, true, []);
		// console.log("SCORE: ", score);
		// console.log("MOVES: ", moves); /
	}

	update(board, turn) {
		this.board = board;
		this.turn = turn;
	}

	minimax(board, depth, alpha, beta, maximizingPlayer, movesPlayed) {
		console.log("---------DEPTH" , depth, "---------");
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
		let fen = this.getFen(board, color);
		console.log("FEN", fen);

		fetch(`https://lichess.org/api/cloud-eval?fen=${fen}`)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				console.log("FIN EVALUATE BOARD");
				return data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	getFen(board, color) {
		let boardCopy = board.map(row => row.map(piece => piece));
		this.displayBoardConsole(boardCopy);

		// change the array to a fen string
		let pieceTypes = ["pawn", "knight", "bishop", "rook", "queen", "king"];
		let fenChar = ["P", "N", "B", "R", "Q", "K", "p", "n", "b", "r", "q", "k"];

		let fen = "";
		let empty = 0;
		for (let i = 0 ; i < boardCopy.length; i++) {
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
			if (i < boardCopy.length - 1) {
				fen += "/";
			}
		}

		color === "white" ? fen += " w " : fen += " b ";
		return fen;
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
}