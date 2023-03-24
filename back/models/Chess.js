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
	}

	getPossibleMoves(piece) {
		const possibleMoves = [];
		let pieceX;
		let pieceY;

		for (let x = 0 ; x < this.board.length ; x++) {
			for(let y = 0 ; y < this.board[x].length ; y++) {
				if (this.board[y][x] === piece) {
					pieceX = x;
					pieceY = y;
					break;
				}
			}
		}
		
		console.table(piece);
		console.log("INIT POS : X ",pieceX, " Y " ,pieceY);
		
		switch (piece.type) {
			case "pawn":
				//avancée du pion
				const pawnDir = piece.color == "white" ? 1 : -1;
				
				if (this.board[pieceY + pawnDir][pieceX] === null) {
					possibleMoves.push({x: pieceX, y: pieceY + pawnDir });
				}

				//avancée double du pion
				if (piece.moved === false) {
					if (this.board[pieceY + pawnDir * 2][pieceX] === null && this.board[pieceY + pawnDir * 2][pieceX] === null){
						possibleMoves.push({x: pieceX, y: pieceY + pawnDir * 2});
						console.log(pieceY + pawnDir * 2,pieceX);
					}
				}

				//prise en diagonale
				const oppositeColor = piece.color == "white" ? "black" : "white";
				
				if (pieceX != 0){
					if (this.board[pieceX - 1][pieceX + pawnDir] !== null) {
						if (this.board[pieceX - 1][pieceX + pawnDir].color === oppositeColor) {
							possibleMoves.push({x: pieceX + 1, y: pieceX + pawnDir});
						}
					}
				}
				
				if (pieceX != 7){
					if (this.board[pieceX + 1][pieceX + pawnDir] !== null) {
						if (this.board[pieceX + 1][pieceX + pawnDir].color === oppositeColor) {
							possibleMoves.push({x: pieceX - 1, y: pieceX + pawnDir});
						}
					}
				}
				
			break;

			case "rook":
				for (let i = pieceX + 1 ; i < this.board.length ; i++) {
					//check if i out of bounds
					if (i > 7) break;

					if (this.board[i][pieceY] === null) {
						possibleMoves.push({x: i, y: pieceY});
					} else {
						if (this.board[i][pieceY].color !== piece.color) {
							possibleMoves.push({x: i, y: pieceY});
						}
						break;
					}
				}

				for (let i = pieceX - 1 ; i < this.board.length ; i--) {
					//check if i out of bounds 
					if (i < 0) break;

					if (this.board[i][pieceY] === null) {
						possibleMoves.push({x: i, y: pieceY});
					} else {
						if (this.board[i][pieceY].color !== piece.color) {
							possibleMoves.push({x: i, y: pieceY});
						}
						break;
					}
				}

				for (let i = pieceY + 1 ; i < this.board.length ; i++) {
					//check if i out of bounds
					if (i > 7) break;

					if (this.board[pieceX][i] === null) {
						possibleMoves.push({x: pieceX, y: i});
					} else {
						if (this.board[pieceX][i].color !== piece.color) {
							possibleMoves.push({x: pieceX, y: i});
						}
						break;
					}
				}

				for (let i = pieceY - 1 ; i < this.board.length ; i--) {
					//check if i out of bounds
					if (i < 0) break;

					if (this.board[pieceX][i] === null) {
						possibleMoves.push({x: pieceX, y: i});
					} else {
						if (this.board[pieceX][i].color !== piece.color) {
							possibleMoves.push({x: pieceX, y: i});
						}
						break;
					}
				}
			break;

			case "knight":
				knightMoves = [
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
						if (this.board[newX][newY] === null) {
							possibleMoves.push({x: newX, y: newY});
						} else {
							if (this.board[newX][newY].color !== piece.color) {
								possibleMoves.push({x: newX, y: newY});
							}
						}
					}
				});
				break;
			
			case "bishop":
				for (let i = 1 ; i < this.board.length ; i++) {
					if (pieceX + i < this.board.length && pieceY + i < this.board.length) {
						if (this.board[pieceX + i][pieceY + i] === null) {
							possibleMoves.push({x: pieceX + i, y: pieceY + i});
						} else {
							if (this.board[pieceX + i][pieceY + i].color !== piece.color) {
								possibleMoves.push({x: pieceX + i, y: pieceY + i});
							}
							break;
						}
					}

					if (pieceX - i >= 0 && pieceY - i >= 0) {
						if (this.board[pieceX - i][pieceY - i] === null) {
							possibleMoves.push({x: pieceX - i, y: pieceY - i});
						} else {
							if (this.board[pieceX - i][pieceY - i].color !== piece.color) {
								possibleMoves.push({x: pieceX - i, y: pieceY - i});
							}
							break;
						}
					}

					if (pieceX + i < this.board.length && pieceY - i >= 0) {
						if (this.board[pieceX + i][pieceY - i] === null) {
							possibleMoves.push({x: pieceX + i, y: pieceY - i});
						} else {
							if (this.board[pieceX + i][pieceY - i].color !== piece.color) {
								possibleMoves.push({x: pieceX + i, y: pieceY - i});
							}
							break;
						}
					}

					if (pieceX - i >= 0 && pieceY + i < this.board.length) {
						if (this.board[pieceX - i][pieceY + i] === null) {
							possibleMoves.push({x: pieceX - i, y: pieceY + i});
						} else {
							if (this.board[pieceX - i][pieceY + i].color !== piece.color) {
								possibleMoves.push({x: pieceX - i, y: pieceY + i});
							}
							break;
						}
					}
				}

				break;

			case "queen":
				// Horizontal and vertical moves
				for (let i = pieceX + 1 ; i < this.board.length ; i++) {
					if (this.board[i][pieceY] === null) {
						possibleMoves.push({x: i, y: pieceY});
					} else {
						if (this.board[i][pieceY].color !== piece.color) {
							possibleMoves.push({x: i, y: pieceY});
						}
						break;
					}
				}

				for (let i = pieceX - 1 ; i < this.board.length ; i--) {
					if (this.board[i][pieceY] === null) {
						possibleMoves.push({x: i, y: pieceY});
					} else {
						if (this.board[i][pieceY].color !== piece.color) {
							possibleMoves.push({x: i, y: pieceY});
						}
						break;
					}
				}

				for (let i = pieceY + 1 ; i < this.board.length ; i++) {
					if (this.board[pieceX][i] === null) {
						possibleMoves.push({x: pieceX, y: i});
					} else {
						if (this.board[pieceX][i].color !== piece.color) {
							possibleMoves.push({x: pieceX, y: i});
						}
						break;
					}
				}

				for (let i = pieceY - 1 ; i < this.board.length ; i--) {
					if (this.board[pieceX][i] === null) {
						possibleMoves.push({x: pieceX, y: i});
					} else {
						if (this.board[pieceX][i].color !== piece.color) {
							possibleMoves.push({x: pieceX, y: i});
						}
						break;
					}
				}
				
				//diagonals
				for (let i = 1 ; i < this.board.length ; i++) {
					if (pieceX + i < this.board.length && pieceY + i < this.board.length) {
						if (this.board[pieceX + i][pieceY + i] === null) {
							possibleMoves.push({x: pieceX + i, y: pieceY + i});
						} else {
							if (this.board[pieceX + i][pieceY + i].color !== piece.color) {
								possibleMoves.push({x: pieceX + i, y: pieceY + i});
							}
							break;
						}
					}

					if (pieceX - i >= 0 && pieceY - i >= 0) {
						if (this.board[pieceX - i][pieceY - i] === null) {
							possibleMoves.push({x: pieceX - i, y: pieceY - i});
						} else {
							if (this.board[pieceX - i][pieceY - i].color !== piece.color) {
								possibleMoves.push({x: pieceX - i, y: pieceY - i});
							}
							break;
						}
					}

					if (pieceX + i < this.board.length && pieceY - i >= 0) {
						if (this.board[pieceX + i][pieceY - i] === null) {
							possibleMoves.push({x: pieceX + i, y: pieceY - i});
						} else {
							if (this.board[pieceX + i][pieceY - i].color !== piece.color) {
								possibleMoves.push({x: pieceX + i, y: pieceY - i});
							}
							break;
						}
					}

					if (pieceX - i >= 0 && pieceY + i < this.board.length) {
						if (this.board[pieceX - i][pieceY + i] === null) {
							possibleMoves.push({x: pieceX - i, y: pieceY + i});
						} else {
							if (this.board[pieceX - i][pieceY + i].color !== piece.color) {
								possibleMoves.push({x: pieceX - i, y: pieceY + i});
							}
							break;
						}
					}
				}
			break;
			
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
						if (this.board[move.x][move.y] === null || this.board[move.x][move.y].color !== piece.color) {
							possibleMoves.push(move);
						}
					}
				});
			break;
		}
		console.log(possibleMoves);
		return possibleMoves;
	}
	
	// Method to move a piece on the board
	movePiece(startY, startX, endY, endX) {
	  // Check if the start position contains a piece
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
	  
	  return true;
	}
  }