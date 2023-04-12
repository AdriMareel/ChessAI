const Piece = require("./Piece");
const Game = require("./Chess");

module.exports = class Engine extends Game {
	constructor() {
		super();
		let { score, moves } = this.minimax(this.board, 5, -Infinity, Infinity, true, []);
		console.log("SCORE: ", score);
		console.log("MOVES: ", moves);
	}

	update(board, turn) {
		this.board = board;
		this.turn = turn;
	}

	minimax(board, depth, alpha, beta, maximizingPlayer, movesPlayed) {
		console.log("---------DEPTH" , depth, "---------");
		if (depth === 0 || this.isGameOver(board)) {
			return { score: this.evaluateBoard(board), moves: movesPlayed };
		}
	
		const moves = this.getAllPossibleMoves(board, maximizingPlayer ? "white" : "black");
		console.log("MOVES :", moves.length);
		if (maximizingPlayer) {
			let maxEval = -Infinity;
			let bestMoves = [];
			for (const move of moves) {
				this.simulateMove(move);
				const { score, moves: nextMoves } = this.minimax(this.board, depth - 1, alpha, beta, false, [...movesPlayed, move]);
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
				this.simulateMove(move);
				const { score, moves: nextMoves } = this.minimax(this.board, depth - 1, alpha, beta, true, [...movesPlayed, move]);
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

	simulateMove(action) {
		const piece = action.piece;
		const move = action.move;

		console.log("SIMULATE MOVE");

		let pieceX;
		let pieceY;

		for (let i = 0; i < this.board.length; i++) {
			for (let j = 0; j < this.board[i].length; j++) {
				if (this.board[i][j] === piece) {
					pieceX = j;
					pieceY = i;
				}
			}
		}

		this.board[move.y][move.x] = this.board[pieceY][pieceX];
		this.board[pieceY][pieceX] = null;
		this.board[move.y][move.x].moved = true;

		this.changeTurn();
	}

	evaluateBoard(board) {
		return 0;
		let score = 0;

		let pieceValues = {
			"pawn": 1,
			"knight": 3,
			"bishop": 3,
			"rook": 5,
			"queen": 9,
		}

		//piece values
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				const piece = board[y][x];
				if (piece) {
					const pieceValue = pieceValues[piece.type];
					score += pieceValue * (piece.color === "white" ? 1 : -1);
				}
			}
		}

		//piece mobility
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				const piece = board[y][x];
				if (piece) {
					const possibleMoves = this.getPossibleMoves(board, piece);
					score += possibleMoves.length * (piece.color === "white" ? 1 : -1);
				}
			}
		}

		//pawn structure
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				const piece = board[y][x];
				if (piece && piece.type === "pawn") {
					const pawnScore = this.evaluatePawn(board, piece, x, y);	
					score += pawnScore * (piece.color === "white" ? 1 : -1);
				}
			}
		}

		//king safety
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				const piece = board[y][x];
				if (piece && piece.type === "king") {
					const kingScore = this.evaluateKing(board, piece, x, y);
					score += kingScore * (piece.color === "white" ? 1 : -1);
				}
			}
		}

		//control of center
		const center = [
			[3, 3], [3, 4], [4, 3], [4, 4]
		];
		let whiteCenter = 0;
		let blackCenter = 0;
		for (let i = 0; i < center.length; i++) {
			const [x, y] = center[i];
			const piece = board[y][x];
			if (piece) {
				if (piece.color === "white") {
					whiteCenter++;
				} else {
					blackCenter++;
				}
			}
		}
		score += (whiteCenter - blackCenter) * 0.1;

		//piece coordination
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				const piece = board[y][x];
				if (piece) {
					const pieceScore = this.evaluatePiece(board, piece, x, y);
					score += pieceScore * (piece.color === "white" ? 1 : -1);
				}
			}
		}

		//tactical opportunities
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				const piece = board[y][x];
				if (piece) {
					const pieceScore = this.evaluateTactics(board, piece, x, y);
					score += pieceScore * (piece.color === "white" ? 1 : -1);
				}
			}
		}

		//positional advantages
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				const piece = board[y][x];
				if (piece) {
					const pieceScore = this.evaluatePosition(board, piece, x, y);
					score += pieceScore * (piece.color === "white" ? 1 : -1);
				}
			}
		}

		return score;
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