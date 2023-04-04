const Piece = require("./Piece");

module.exports = class Game {
	constructor() {
		this.board = [
			[new Piece("white", "rook"), new Piece("white", "knight"), new Piece("white", "bishop"), new Piece("white", "queen"), new Piece("white", "king"), new Piece("white", "bishop"), new Piece("white", "knight"), new Piece("white", "rook")],
			[new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn")],
			[null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null],
			[new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn")],
			[new Piece("black", "rook"), new Piece("black", "knight"), new Piece("black", "bishop"), new Piece("black", "queen"), new Piece("black", "king"), new Piece("black", "bishop"), new Piece("black", "knight"), new Piece("black", "rook")]
		];
		this.turn = "white";
	}

	reset() {
		delete this.board;
		this.board = [
			[new Piece("white", "rook"), new Piece("white", "knight"), new Piece("white", "bishop"), new Piece("white", "queen"), new Piece("white", "king"), new Piece("white", "bishop"), new Piece("white", "knight"), new Piece("white", "rook")],
			[new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn")],
			[null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null],
			[new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn")],
			[new Piece("black", "rook"), new Piece("black", "knight"), new Piece("black", "bishop"), new Piece("black", "queen"), new Piece("black", "king"), new Piece("black", "bishop"), new Piece("black", "knight"), new Piece("black", "rook")]
		];
		this.turn = "white";
	}

	getPossibleMoves(piece, checking = false) {
		const possibleMoves = [];
		let pieceX;
		let pieceY;

		if (!checking) {
 			if (piece === null || piece.color != this.turn) {
			 	return possibleMoves;
			}
		}
		

		for (let x = 0; x < this.board.length; x++) {
			for (let y = 0; y < this.board[x].length; y++) {
				if (this.board[y][x] === piece) {
					pieceX = x;
					pieceY = y;
					break;
				}
			}
		}

		switch (piece.type) {
			case "pawn":
				const pawnDir = piece.color == "white" ? 1 : -1;
				const oppositeColor = piece.color == "white" ? "black" : "white";

				if (!checking) {
					
					//avancée du pion
					if (this.board[pieceY + pawnDir][pieceX] === null) {
						possibleMoves.push({ x: pieceX, y: pieceY + pawnDir });

						//avancée double du pion
						if (piece.moved === false) {
							if (this.board[pieceY + pawnDir * 2][pieceX] === null && this.board[pieceY + pawnDir * 2][pieceX] === null) {
								possibleMoves.push({ x: pieceX, y: pieceY + pawnDir * 2 });
							}
						}
					}

					//prise en diagonale

					if (pieceX != 0) {
						if (this.board[pieceY + pawnDir][pieceX - 1] !== null) {
							if (this.board[pieceY + pawnDir][pieceX - 1].color === oppositeColor) {
								possibleMoves.push({ x: pieceX - 1, y: pieceY + pawnDir });
							}
						}
					}

					if (pieceX != 7) {
						if (this.board[pieceY + pawnDir][pieceX + 1] !== null) {
							if (this.board[pieceY + pawnDir][pieceX + 1].color === oppositeColor) {
								possibleMoves.push({ x: pieceX + 1, y: pieceY + pawnDir });
							}
						}
					}
				}

				if (checking){
					if (pieceX != 0) {
						possibleMoves.push({ x: pieceX - 1, y: pieceY + pawnDir });
					}

					if (pieceX != 7) {
						possibleMoves.push({ x: pieceX + 1, y: pieceY + pawnDir });
					}
				}

				break;

			case "rook":
				for (let i = pieceX + 1; i < this.board.length; i++) {
					//check if i out of bounds
					if (i > 7) break;

					if (this.board[pieceY][i] === null) {
						possibleMoves.push({ x: i, y: pieceY });
					} else {
						if (this.board[pieceY][i].color !== piece.color) {
							possibleMoves.push({ x: i, y: pieceY });
						}
						break;
					}
				}

				for (let i = pieceX - 1; i < this.board.length; i--) {
					//check if i out of bounds 
					if (i < 0) break;

					if (this.board[pieceY][i] === null) {
						possibleMoves.push({ x: i, y: pieceY });
					} else {
						if (this.board[pieceY][i].color !== piece.color) {
							possibleMoves.push({ x: i, y: pieceY });
						}
						break;
					}
				}

				for (let i = pieceY + 1; i < this.board.length; i++) {
					//check if i out of bounds
					if (i > 7) break;

					if (this.board[i][pieceX] === null) {
						possibleMoves.push({ x: pieceX, y: i });
					} else {
						if (this.board[i][pieceX].color !== piece.color) {
							possibleMoves.push({ x: pieceX, y: i });
						}
						break;
					}
				}

				for (let i = pieceY - 1; i < this.board.length; i--) {
					//check if i out of bounds
					if (i < 0) break;

					if (this.board[i][pieceX] === null) {
						possibleMoves.push({ x: pieceX, y: i });
					} else {
						if (this.board[i][pieceX].color !== piece.color) {
							possibleMoves.push({ x: pieceX, y: i });
						}
						break;
					}
				}
				break;

			case "knight":
				let knightMoves = [
					{ x: 2, y: 1 },
					{ x: 2, y: -1 },
					{ x: -2, y: 1 },
					{ x: -2, y: -1 },
					{ x: 1, y: 2 },
					{ x: 1, y: -2 },
					{ x: -1, y: 2 },
					{ x: -1, y: -2 }
				]

				knightMoves.forEach(move => {
					const newX = pieceX + move.x;
					const newY = pieceY + move.y;

					if (newX >= 0 && newX < this.board.length && newY >= 0 && newY < this.board.length) {
						if (this.board[newY][newX] === null) {
							possibleMoves.push({ x: newX, y: newY });
						} else {
							if (this.board[newY][newX].color !== piece.color) {
								possibleMoves.push({ x: newX, y: newY });
							}
						}
					}
				});
				break;

			case "bishop":
				// mouvement vers la haut droite
				for (let i = 1; pieceX + i < this.board.length && pieceY + i < this.board.length; i++) {
					if (this.board[pieceY + i][pieceX + i] === null) {
						possibleMoves.push({ x: pieceX + i, y: pieceY + i });
					} else {
						if (this.board[pieceY + i][pieceX + i].color !== piece.color) {
							possibleMoves.push({ x: pieceX + i, y: pieceY + i });
						}
						break;
					}
				}

				// mouvement vers la haut gauche
				for (let i = 1; pieceX - i >= 0 && pieceY + i < this.board.length; i++) {
					if (this.board[pieceY + i][pieceX - i] === null) {
						possibleMoves.push({ x: pieceX - i, y: pieceY + i });
					} else {
						if (this.board[pieceY + i][pieceX - i].color !== piece.color) {
							possibleMoves.push({ x: pieceX - i, y: pieceY + i });
						}
						break;
					}
				}

				// mouvement vers la bas gauche
				for (let i = 1; pieceX - i >= 0 && pieceY - i >= 0; i++) {
					if (this.board[pieceY - i][pieceX - i] === null) {
						possibleMoves.push({ x: pieceX - i, y: pieceY - i });
					} else {
						if (this.board[pieceY - i][pieceX - i].color !== piece.color) {
							possibleMoves.push({ x: pieceX - i, y: pieceY - i });
						}
						break;
					}
				}

				// mouvement vers la bas droite
				for (let i = 1; pieceX + i < this.board.length && pieceY - i >= 0; i++) {
					if (this.board[pieceY - i][pieceX + i] === null) {
						possibleMoves.push({ x: pieceX + i, y: pieceY - i });
					} else {
						if (this.board[pieceY - i][pieceX + i].color !== piece.color) {
							possibleMoves.push({ x: pieceX + i, y: pieceY - i });
						}
						break;
					}
				}

				break;

			case "queen":
				// Horizontal and vertical moves
				for (let i = pieceX + 1; i < this.board.length; i++) {
					if (this.board[pieceY][i] === null) {
						possibleMoves.push({ x: i, y: pieceY });
					} else {
						if (this.board[pieceY][i].color !== piece.color) {
							possibleMoves.push({ x: i, y: pieceY });
						}
						break;
					}
				}

				for (let i = pieceX - 1; i >= 0; i--) {
					if (this.board[pieceY][i] === null) {
						possibleMoves.push({ x: i, y: pieceY });
					} else {
						if (this.board[pieceY][i].color !== piece.color) {
							possibleMoves.push({ x: i, y: pieceY });
						}
						break;
					}
				}

				for (let i = pieceY + 1; i < this.board.length; i++) {
					if (this.board[i][pieceX] === null) {
						possibleMoves.push({ x: pieceX, y: i });
					} else {
						if (this.board[i][pieceX].color !== piece.color) {
							possibleMoves.push({ x: pieceX, y: i });
						}
						break;
					}
				}

				for (let i = pieceY - 1; i >= 0; i--) {
					if (this.board[i][pieceX] === null) {
						possibleMoves.push({ x: pieceX, y: i });
					} else {
						if (this.board[i][pieceX].color !== piece.color) {
							possibleMoves.push({ x: pieceX, y: i });
						}
						break;
					}
				}


				// Top left
				for (let i = 1; pieceX + i < this.board.length && pieceY + i < this.board.length; i++) {
					if (this.board[pieceY + i][pieceX + i] === null) {
						possibleMoves.push({ x: pieceX + i, y: pieceY + i });
					} else {
						if (this.board[pieceY + i][pieceX + i].color !== piece.color) {
							possibleMoves.push({ x: pieceX + i, y: pieceY + i });
						}
						break;
					}
				}
				// Top right
				for (let i = 1; pieceX - i >= 0 && pieceY + i < this.board.length; i++) {
					if (this.board[pieceY + i][pieceX - i] === null) {
						possibleMoves.push({ x: pieceX - i, y: pieceY + i });
					} else {
						if (this.board[pieceY + i][pieceX - i].color !== piece.color) {
							possibleMoves.push({ x: pieceX - i, y: pieceY + i });
						}
						break;
					}
				}
				// Bottom left
				for (let i = 1; pieceX - i >= 0 && pieceY - i >= 0; i++) {
					if (this.board[pieceY - i][pieceX - i] === null) {
						possibleMoves.push({ x: pieceX - i, y: pieceY - i });
					} else {
						if (this.board[pieceY - i][pieceX - i].color !== piece.color) {
							possibleMoves.push({ x: pieceX - i, y: pieceY - i });
						}
						break;
					}
				}
				// Bottom right
				for (let i = 1; pieceX + i < this.board.length && pieceY - i >= 0; i++) {
					if (this.board[pieceY - i][pieceX + i] === null) {
						possibleMoves.push({ x: pieceX + i, y: pieceY - i });
					} else {
						if (this.board[pieceY - i][pieceX + i].color !== piece.color) {
							possibleMoves.push({ x: pieceX + i, y: pieceY - i });
						}
						break;
					}
				}

			case "king":
				const kingMoves = [
					{ x: pieceX + 1, y: pieceY },
					{ x: pieceX + 1, y: pieceY + 1 },
					{ x: pieceX, y: pieceY + 1 },
					{ x: pieceX - 1, y: pieceY + 1 },
					{ x: pieceX - 1, y: pieceY },
					{ x: pieceX - 1, y: pieceY - 1 },
					{ x: pieceX, y: pieceY - 1 },
					{ x: pieceX + 1, y: pieceY - 1 }
				];

				kingMoves.forEach(move => {
					if (move.x >= 0 && move.x < this.board.length && move.y >= 0 && move.y < this.board.length) {
						if (this.board[move.y][move.x] === null || this.board[move.y][move.x].color !== piece.color) {
							possibleMoves.push(move);
						}
					}
				});

				if (piece.moved === false) {
					//castling
					if (this.board[pieceY][pieceX + 3] && this.board[pieceY][pieceX + 3].type === "rook" && this.board[pieceY][pieceX + 3].moved === false) {
						if (this.board[pieceY][pieceX + 1] === null && this.board[pieceY][pieceX + 2] === null) {
							possibleMoves.push({ x: pieceX + 2, y: pieceY });
						}
					}
					if (this.board[pieceY][pieceX - 4] && this.board[pieceY][pieceX - 4].type === "rook" && this.board[pieceY][pieceX - 4].moved === false) {
						if (this.board[pieceY][pieceX - 1] === null && this.board[pieceY][pieceX - 2] === null && this.board[pieceY][pieceX - 3] === null) {
							possibleMoves.push({ x: pieceX - 2, y: pieceY });
						}
					}
				}
				break;
		}

		if (checking) {
			return possibleMoves;
		}

		let legalMoves = [];

		//check if any of moves would lead to a check
		possibleMoves.forEach(move => {
			const tempBoard = this.board.map(row => row.map(piece => piece));
			tempBoard[move.y][move.x] = tempBoard[pieceY][pieceX];
			tempBoard[pieceY][pieceX] = null;
			tempBoard[move.y][move.x].moved = true;
			if (!this.checkIfChecked(tempBoard, piece.color)) {
				legalMoves.push(move);
			}
			tempBoard[move.y][move.x].moved = false;
		});

		return legalMoves;
	}

	movePiece(startX, startY, endX, endY) {

		// let array = this.getPossibleMoves(this.board[startY][startX]);
		// console.log(array);
		// if (!array.includes({ x: endX, y: endY })) return false;

		if (!this.board[startY][startX]) {
			console.log("No piece at the start position!");
			return false;
		}

		// Check if the end position is empty or contains an opponent's piece

		if (this.board[endY][endX] && this.board[endY][endX].color === this.board[startY][startX].color) {
			console.log("Can't capture your own piece!");
			return false;
		}

		// Move the piece to the end position
		this.board[endY][endX] = this.board[startY][startX];
		this.board[startY][startX] = null;

		this.board[endY][endX].moved = true;

		this.changeTurn();
		return true;
	}

	changeTurn() {
		if (this.turn === "white") {
			this.turn = "black";
		} else if (this.turn === "black") {
			this.turn = "white";
		}
	}

	checkIfChecked(board, color) {

		//find king
		let kingX = 0;
		let kingY = 0;

		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				if (board[i][j] !== null && board[i][j].type === "king" && board[i][j].color === color) {
					kingX = j;
					kingY = i;
				}
			}
		}
		console.log("KING POS", kingX, kingY);

		let possibleMoves = [];
		//check if any of the opponent's pieces can move to the king's position
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				if (board[i][j] !== null && board[i][j].color !== color) {
					possibleMoves.push(this.getPossibleMoves(this.board[i][j], true));
				}
			}
		}
		console.log("--------- POSSIBLE MOVES ---------")
		console.log(possibleMoves);
		possibleMoves = possibleMoves.flat();

		//check if any of the possible moves is the king's position
		for (let k = 0; k < possibleMoves.length; k++) {
			if (possibleMoves[k].x === kingX && possibleMoves[k].y === kingY) {
				return true;
			}
		}
		return false;
	}
}