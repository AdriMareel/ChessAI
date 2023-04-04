import { getPossibleMoves, clickedPiece, move, } from "./chess.js";

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

let board = document.getElementById("board");
for (let i = 0; i < 9; i++) {
	let row = document.createElement("div");
	row.className = "row";
	
		for (let j = 0; j < 9; j++) {
			let cell = document.createElement("div");
			//caracteristique spéciale pour la première ligne 
			if(i==0){
				cell.className = "colonne";
				cell.innerText = String.fromCharCode(96 + j);
				//en particulier pour la première case
				if(j==0){
					cell.className = "ligne";
					cell.innerText = "";
				}
			}
			//caracteristique spéciale pour la première colonne
			else if(j==0){
				cell.className = "ligne";
				cell.innerText = i;
			}

			//Pour toute les cases "normales"
			else{
				cell.className = "square";
				cell.id = String.fromCharCode(96 + j) + (i);
				
				// on met la classe light ou dark en fonction de la position de la case
				if((j+i)%2==1){
					cell.classList.add("light");
				}
				else{
					cell.classList.add("dark");
				} 
			}
			row.appendChild(cell);
		}
	board.appendChild(row);
}

export function untoggleMoveMode(){
	for (let item of document.getElementsByClassName("square")) {
		//delete previous event listeners
		const newElement = item.cloneNode(true);
		item.replaceWith(newElement);
		newElement.addEventListener("click", () => getPossibleMoves(item.id));
		newElement.classList.remove("possibleMove");
	}
}
untoggleMoveMode();

//chess pieces initialisation
for (let i = 0; i < chessCoordInit.length; i++) {
	document.getElementById(chessCoordInit[i]).innerHTML = `<img src="public/pieces/${chessPieceInit[i]}.png" alt="${chessPieceInit[i]}" class="piece" >`;
}

export function displayPossibleMoves(id){
    document.getElementById(id).classList.add("possibleMove");
}

export function removePossibleMoves(){
	const possibleMoves = document.querySelectorAll('.possibleMove');
  	possibleMoves.forEach(move => move.classList.remove('possibleMove'));
}

export function toggleMoveMode(){
	for (let item of document.getElementsByClassName("possibleMove")) {
		const newElement = item.cloneNode(true);
		item.replaceWith(newElement);
		newElement.addEventListener('click', () => move(clickedPiece, item.id));
	}
}

export function displayMove(piece, destination){
	document.getElementById(destination).innerHTML = document.getElementById(piece).innerHTML;
	document.getElementById(piece).innerHTML = "";
}


//put the king of color in check
export function isCheck(color){
		//get element with alt color-king
		let king = document.querySelector(`img[alt="${color}-king"]`);
		//get the id of the king
		let kingId = king.parentElement.id;
		//add the class check to the king parent id
		document.getElementById(kingId).classList.add("checked");
};

export function clearCheck(){
	for (let item of document.getElementsByClassName("square")) {
		item.classList.remove("checked");
	}
}