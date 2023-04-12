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
		this.moveType = "";
		this.moveHistory = [];
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
		this.moveType = "";
		this.moveHistory = [];
	}

	getPossibleMoves(board, piece, checking = false) {
		const possibleMoves = [];
		let pieceX;
		let pieceY;

		if (!checking) {
 			if (piece === null || piece.color != this.turn) {
			 	return possibleMoves;
			}
		}
		

		for (let x = 0; x < board.length; x++) {
			for (let y = 0; y < board[x].length; y++) {
				if (board[y][x] === piece) {
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
					if (board[pieceY + pawnDir][pieceX] === null) {
						possibleMoves.push({ x: pieceX, y: pieceY + pawnDir });

						//avancée double du pion
						if (piece.moved === false) {
							if (board[pieceY + pawnDir * 2][pieceX] === null && board[pieceY + pawnDir * 2][pieceX] === null) {
								possibleMoves.push({ x: pieceX, y: pieceY + pawnDir * 2 });
							}
						}
					}

					//prise en diagonale

					if (pieceX != 0) {
						if (board[pieceY + pawnDir][pieceX - 1] !== null) {
							if (board[pieceY + pawnDir][pieceX - 1].color === oppositeColor) {
								possibleMoves.push({ x: pieceX - 1, y: pieceY + pawnDir });
							}
						}
					}

					if (pieceX != 7) {
						if (board[pieceY + pawnDir][pieceX + 1] !== null) {
							if (board[pieceY + pawnDir][pieceX + 1].color === oppositeColor) {
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
				for (let i = pieceX + 1; i < board.length; i++) {
					//check if i out of bounds
					if (i > 7) break;

					if (board[pieceY][i] === null) {
						possibleMoves.push({ x: i, y: pieceY });
					} else {
						if (board[pieceY][i].color !== piece.color) {
							possibleMoves.push({ x: i, y: pieceY });
						}
						break;
					}
				}

				for (let i = pieceX - 1; i < board.length; i--) {
					//check if i out of bounds 
					if (i < 0) break;

					if (board[pieceY][i] === null) {
						possibleMoves.push({ x: i, y: pieceY });
					} else {
						if (board[pieceY][i].color !== piece.color) {
							possibleMoves.push({ x: i, y: pieceY });
						}
						break;
					}
				}

				for (let i = pieceY + 1; i < board.length; i++) {
					//check if i out of bounds
					if (i > 7) break;

					if (board[i][pieceX] === null) {
						possibleMoves.push({ x: pieceX, y: i });
					} else {
						if (board[i][pieceX].color !== piece.color) {
							possibleMoves.push({ x: pieceX, y: i });
						}
						break;
					}
				}

				for (let i = pieceY - 1; i < board.length; i--) {
					//check if i out of bounds
					if (i < 0) break;

					if (board[i][pieceX] === null) {
						possibleMoves.push({ x: pieceX, y: i });
					} else {
						if (board[i][pieceX].color !== piece.color) {
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

					if (newX >= 0 && newX < board.length && newY >= 0 && newY < board.length) {
						if (board[newY][newX] === null) {
							possibleMoves.push({ x: newX, y: newY });
						} else {
							if (board[newY][newX].color !== piece.color) {
								possibleMoves.push({ x: newX, y: newY });
							}
						}
					}
				});
				break;

			case "bishop":
				// mouvement vers la haut droite
				for (let i = 1; pieceX + i < board.length && pieceY + i < board.length; i++) {
					if (board[pieceY + i][pieceX + i] === null) {
						possibleMoves.push({ x: pieceX + i, y: pieceY + i });
					} else {
						if (board[pieceY + i][pieceX + i].color !== piece.color) {
							possibleMoves.push({ x: pieceX + i, y: pieceY + i });
						}
						break;
					}
				}

				// mouvement vers la haut gauche
				for (let i = 1; pieceX - i >= 0 && pieceY + i < board.length; i++) {
					if (board[pieceY + i][pieceX - i] === null) {
						possibleMoves.push({ x: pieceX - i, y: pieceY + i });
					} else {
						if (board[pieceY + i][pieceX - i].color !== piece.color) {
							possibleMoves.push({ x: pieceX - i, y: pieceY + i });
						}
						break;
					}
				}

				// mouvement vers la bas gauche
				for (let i = 1; pieceX - i >= 0 && pieceY - i >= 0; i++) {
					if (board[pieceY - i][pieceX - i] === null) {
						possibleMoves.push({ x: pieceX - i, y: pieceY - i });
					} else {
						if (board[pieceY - i][pieceX - i].color !== piece.color) {
							possibleMoves.push({ x: pieceX - i, y: pieceY - i });
						}
						break;
					}
				}

				// mouvement vers la bas droite
				for (let i = 1; pieceX + i < board.length && pieceY - i >= 0; i++) {
					if (board[pieceY - i][pieceX + i] === null) {
						possibleMoves.push({ x: pieceX + i, y: pieceY - i });
					} else {
						if (board[pieceY - i][pieceX + i].color !== piece.color) {
							possibleMoves.push({ x: pieceX + i, y: pieceY - i });
						}
						break;
					}
				}

				break;

			case "queen":
				// Horizontal and vertical moves
				for (let i = pieceX + 1; i < board.length; i++) {
					if (board[pieceY][i] === null) {
						possibleMoves.push({ x: i, y: pieceY });
					} else {
						if (board[pieceY][i].color !== piece.color) {
							possibleMoves.push({ x: i, y: pieceY });
						}
						break;
					}
				}

				for (let i = pieceX - 1; i >= 0; i--) {
					if (board[pieceY][i] === null) {
						possibleMoves.push({ x: i, y: pieceY });
					} else {
						if (board[pieceY][i].color !== piece.color) {
							possibleMoves.push({ x: i, y: pieceY });
						}
						break;
					}
				}

				for (let i = pieceY + 1; i < board.length; i++) {
					if (board[i][pieceX] === null) {
						possibleMoves.push({ x: pieceX, y: i });
					} else {
						if (board[i][pieceX].color !== piece.color) {
							possibleMoves.push({ x: pieceX, y: i });
						}
						break;
					}
				}

				for (let i = pieceY - 1; i >= 0; i--) {
					if (board[i][pieceX] === null) {
						possibleMoves.push({ x: pieceX, y: i });
					} else {
						if (board[i][pieceX].color !== piece.color) {
							possibleMoves.push({ x: pieceX, y: i });
						}
						break;
					}
				}


				// Top left
				for (let i = 1; pieceX + i < board.length && pieceY + i < board.length; i++) {
					if (board[pieceY + i][pieceX + i] === null) {
						possibleMoves.push({ x: pieceX + i, y: pieceY + i });
					} else {
						if (board[pieceY + i][pieceX + i].color !== piece.color) {
							possibleMoves.push({ x: pieceX + i, y: pieceY + i });
						}
						break;
					}
				}
				// Top right
				for (let i = 1; pieceX - i >= 0 && pieceY + i < board.length; i++) {
					if (board[pieceY + i][pieceX - i] === null) {
						possibleMoves.push({ x: pieceX - i, y: pieceY + i });
					} else {
						if (board[pieceY + i][pieceX - i].color !== piece.color) {
							possibleMoves.push({ x: pieceX - i, y: pieceY + i });
						}
						break;
					}
				}
				// Bottom left
				for (let i = 1; pieceX - i >= 0 && pieceY - i >= 0; i++) {
					if (board[pieceY - i][pieceX - i] === null) {
						possibleMoves.push({ x: pieceX - i, y: pieceY - i });
					} else {
						if (board[pieceY - i][pieceX - i].color !== piece.color) {
							possibleMoves.push({ x: pieceX - i, y: pieceY - i });
						}
						break;
					}
				}
				// Bottom right
				for (let i = 1; pieceX + i < board.length && pieceY - i >= 0; i++) {
					if (board[pieceY - i][pieceX + i] === null) {
						possibleMoves.push({ x: pieceX + i, y: pieceY - i });
					} else {
						if (board[pieceY - i][pieceX + i].color !== piece.color) {
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
					if (move.x >= 0 && move.x < board.length && move.y >= 0 && move.y < board.length) {
						if (board[move.y][move.x] === null || board[move.y][move.x].color !== piece.color) {
							possibleMoves.push(move);
						}
					}
				});

				if (piece.moved === false) {
					//castling
					if (board[pieceY][pieceX + 3] && board[pieceY][pieceX + 3].type === "rook" && board[pieceY][pieceX + 3].moved === false) {
						if (board[pieceY][pieceX + 1] === null && board[pieceY][pieceX + 2] === null) {
							possibleMoves.push({ x: pieceX + 2, y: pieceY });
						}
					}
					if (board[pieceY][pieceX - 4] && board[pieceY][pieceX - 4].type === "rook" && board[pieceY][pieceX - 4].moved === false) {
						if (board[pieceY][pieceX - 1] === null && board[pieceY][pieceX - 2] === null && board[pieceY][pieceX - 3] === null) {
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
			const tempBoard = board.map(row => row.map(piece => piece));
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
		if (!this.board[startY][startX]) {
			console.log("No piece at the start position!");
			return false;
		}

		// Check if the end position is empty or contains an opponent's piece
		if (this.board[endY][endX] && this.board[endY][endX].color === this.board[startY][startX].color) {
			console.log("Can't capture your own piece!");
			return false;
		}
		// move type = move if the end position is empty
		if (!this.board[endY][endX]) {
            this.moveType = "move";
        }
        // move type = capture if the end position contains an opponent's piece
        if(this.board[endY][endX] && this.board[endY][endX].color !== this.board[startY][startX].color) {
            this.moveType = "capture";
        }
        //move type = check if the piece checks the opponent's king
        if (this.checkIfChecked(this.board, this.board[startY][startX].color) === true) {
            this.moveType = "check";
        }

		// Move the piece to the end position
		this.board[endY][endX] = this.board[startY][startX];
		this.board[startY][startX] = null;

		this.board[endY][endX].moved = true;

		this.changeTurn();
		return true;
	}

	xyToChessCoordinate(xyObj) {
		const file = String.fromCharCode(97 + xyObj.x);
		const rank = xyObj.y + 1;
		return file + rank;
	}

	displayHistory() {
		console.log(this.moveHistory);
	}

	// update the moves history every time a piece is moved
	updateHistory(board,piece,xEnd,yEnd,startX,startY) {
		let move;
		let pieceX;
		let pieceY;
		console.log(piece);
		console.log(this.moveType)


		for (let x = 0; x < board.length; x++) {
			for (let y = 0; y < board[x].length; y++) {
				if (board[y][x] === piece) {
					pieceX = x;
					pieceY = y;
					break;
				}
			}
		}

		if(this.moveType === "move" && piece.type === "pawn") {
			yEnd = yEnd;
			xEnd = xEnd;
			move = this.xyToChessCoordinate({x:xEnd,y:yEnd});
			// push the move the piece made
			this.moveHistory.push(move);
		}
		else if(this.moveType === "move") {
			yEnd = yEnd;
			xEnd = xEnd;
			move = this.xyToChessCoordinate({x:xEnd,y:yEnd});
			// push the move the piece made
			this.moveHistory.push(piece.type.charAt(0)+move);
		}
		if(this.moveType === "capture" && piece.type === "pawn") {
			yEnd = yEnd;
			xEnd = xEnd;
			move = this.xyToChessCoordinate({x:xEnd,y:yEnd});
			this.moveHistory.push(this.xyToChessCoordinate({x:startX,y:startY}).charAt(0) +"x"+move);
		}
		else if(this.moveType === "capture") {
			yEnd = yEnd;
			xEnd = xEnd;
			move = this.xyToChessCoordinate({x:xEnd,y:yEnd});
			this.moveHistory.push(piece.type.charAt(0) +"x"+move);
		}
		if(this.moveType === "check" && piece.type === "pawn") {
			yEnd = yEnd;
			xEnd = xEnd;
			move = this.xyToChessCoordinate({x:xEnd,y:yEnd});
			this.moveHistory.push(move+"+");
		}
		else if(this.moveType === "check") {
			yEnd = yEnd;
			xEnd = xEnd;
			move = this.xyToChessCoordinate({x:xEnd,y:yEnd});
			this.moveHistory.push(piece.type.charAt(0)+move+"+");
		}
		/*if(moveType === "checkmate") {
			yEnd = yEnd;
			xEnd = xEnd;
			move = this.xyToChessCoordinate({x:xEnd,y:yEnd});
			this.moveHistory.push(piece.type.charAt(0)+move+"#");
		}*/
		/*if(moveType === "castle") {
			yEnd = yEnd;
			xEnd = xEnd;
			move = this.xyToChessCoordinate({x:xEnd,y:yEnd});
			this.moveHistory.push("O-O");
		}
		if(moveType === "castleLong") {
			yEnd = yEnd;
			xEnd = xEnd;
			move = this.xyToChessCoordinate({x:xEnd,y:yEnd});
			this.moveHistory.push("O-O-O");
		}
		if(moveType === "promotion") {
			yEnd = yEnd;
			xEnd = xEnd;
			move = this.xyToChessCoordinate({x:xEnd,y:yEnd});
			this.moveHistory.push(piece.type.charAt(0)+move+"="+piece.type.charAt(0));
		}*/


		console.log("----- HISTORY -----");
		this.displayHistory();
		return this.moveHistory;
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

		let possibleMoves = [];
		//check if any of the opponent's pieces can move to the king's position
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				if (board[i][j] !== null && board[i][j].color !== color) {
					possibleMoves.push(this.getPossibleMoves(board, this.board[i][j], true));
				}
			}
		}
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