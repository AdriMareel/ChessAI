const Piece = require("./Piece");
const Game = require("./Chess");

module.exports = class Engine extends Game {
	constructor() {
		super();
	}

	update(board, turn) {
		this.board = board;
		this.turn = turn;
	}

	minimax(possibleMoves, depth, alpha, beta, maximizingPlayer) {
		if (depth === 0 || this.isGameOver(board)) {
			return this.evaluateBoard(board);
		}

		if (maximizingPlayer) {
			maxEval = -Infinity;
			for (let i = 0; i < possibleMoves.length; i++) {
				const move = possibleMoves[i];
				this.simulateMove(move);
				const evaluation = this.minimax(move, depth - 1, alpha, beta, false);
				maxEval = Math.max(maxEval, evaluation);
				alpha = Math.max(alpha, evaluation);
				if (beta <= alpha) {
					break;
				}
			}
		}	
		
		else {
			minEval = Infinity;
			for (let i = 0; i < possibleMoves.length; i++) {
				const move = possibleMoves[i];
				this.simulateMove(move);
				const evaluation = this.minimax(move, depth - 1, alpha, beta, true);
				minEval = Math.min(minEval, evaluation);
				beta = Math.min(beta, evaluation);
				if (beta <= alpha) {
					break;
				}
			}
		}
	}

	simulateMove(move) {
		const piece = this.board[move.y][move.x];
		const pieceNext = this.board[move.yNext][move.xNext];

		this.board[move.yNext][move.xNext] = piece;
		this.board[move.y][move.x] = null;
	}

	evaluateBoard(board) {
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
}