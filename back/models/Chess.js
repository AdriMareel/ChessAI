class Game {
	constructor() {
	  this.board = [
		[new Piece("black", "rook"), new Piece("black", "knight"), new Piece("black", "bishop"), new Piece("black", "queen"), new Piece("black", "king"), new Piece("black", "bishop"), new Piece("black", "knight"), new Piece("black", "rook")],
		[new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn"), new Piece("black", "pawn")],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn"), new Piece("white", "pawn")],
		[new Piece("white", "rook"), new Piece("white", "knight"), new Piece("white", "bishop"), new Piece("white", "queen"), new Piece("white", "king"), new Piece("white", "bishop"), new Piece("white", "knight"), new Piece("white", "rook")]
	  ];
	}

	getPossibleMoves(piece) {
		const possibleMoves = [];

		for (let x = 0 ; x < this.board.length ; x++) {
			for(let y = 0 ; y < this.board[x].length ; y++) {
				if (this.board[x][y] === piece) {
					const piecePos = {x, y};
					break;
				}
			}
		}

		switch (piece.type) {
			case "pawn":
				//avancée du pion
				const pawnDir = piece.color == "white" ? -1 : 1;
				if (this.board[pieceX][pieceX + pawnDir] === null) {
					possibleMoves.push({x: pieceX, y: pieceX + pawnDir});
				}

				//prise en diagonale
				const oppositeColor = piece.color == "white" ? "black" : "white";
				if (this.board[pieceX + 1][pieceX + pawnDir]){
					if (this.board[pieceX - 1][pieceX + pawnDir].color === oppositeColor) {
						possibleMoves.push({x: pieceX + 1, y: pieceX + pawnDir});
					}

					if (this.board[pieceX - 1][pieceX + pawnDir].color === oppositeColor) {
						possibleMoves.push({x: pieceX - 1, y: pieceX + pawnDir});
					}
				}

				
		}

				//


	}
	
	// Method to move a piece on the board
	movePiece(startY, startY, endY, endX) {
	  // Check if the start position contains a piece
	  if (!this.board[startY][startY]) {
		console.log("No piece at the start position!");
		return false;
	  }
	  
	  // Check if the end position is empty or contains an opponent's piece
	  if (this.board[endY][endX] && this.board[endY][endX].color === this.board[startY][startY].color) {
		console.log("Can't capture your own piece!");
		return false;
	  }
	  
	  // Move the piece to the end position
	  this.board[endY][endX] = this.board[startY][startY];
	  this.board[startY][startY] = null;
	  
	  return true;
	}
  }