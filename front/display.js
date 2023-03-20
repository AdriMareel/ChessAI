const chessCoordInit = [
	"a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1", // White pieces
	"a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",  // White pawns
	"a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", // Black pawns
	"a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"  // Black pieces
];

const chessPieceInit = [
	"white-rook", "white-knight", "white-bishop", "white-queen", "white-king", "white-bishop", "white-knight", "white-rook", // White pieces
	"white-pawn", "white-pawn", "white-pawn", "white-pawn", "white-pawn", "white-pawn", "white-pawn", "white-pawn", // White pawns
	"black-pawn", "black-pawn", "black-pawn", "black-pawn", "black-pawn", "black-pawn", "black-pawn", "black-pawn", // Black pawns
	"black-rook", "black-knight", "black-bishop", "black-queen", "black-king", "black-bishop", "black-knight", "black-rook"  // Black pieces
];

//chess pieces initialisation
for (let i = 0; i < chessCoordInit.length; i++) {
	document.getElementById(chessCoordInit[i]).innerHTML = `<img src="public/pieces/${chessPieceInit[i]}.png" alt="${chessPieceInit[i]}" class="piece" id="${chessPieceInit[i]}">`;
}