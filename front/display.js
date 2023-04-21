import { getPossibleMoves, clickedPiece, move } from "./chess.js";
let turn = 0;
const chessCoordInit = [	
	"a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",  // Black pieces
	"a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", // Black pawns
	"a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",  // White pawns
	"a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1" // White pieces
];

const chessPieceInit = [
	"black-rook", "black-knight", "black-bishop", "black-queen", "black-king", "black-bishop", "black-knight", "black-rook",  // Black pieces
	"black-pawn", "black-pawn", "black-pawn", "black-pawn", "black-pawn", "black-pawn", "black-pawn", "black-pawn", // Black pawns
	"white-pawn", "white-pawn", "white-pawn", "white-pawn", "white-pawn", "white-pawn", "white-pawn", "white-pawn", // White pawns
	"white-rook", "white-knight", "white-bishop", "white-queen", "white-king", "white-bishop", "white-knight", "white-rook" // White pieces
];

document.getElementById('endGame').style.display = "none";

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
				cell.innerText = 9 - i;
			}

			//Pour toute les cases "normales"
			else{
				cell.className = "square";
				cell.id = String.fromCharCode(96 + j) + (9 - i);
				
				// on met la classe light ou dark en fonction de la position de la case
				if((j+i)%2== 0){
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

export function displaySelected(id){
    document.getElementById(id).classList.add("selected");
}

export function displayPossibleMoves(id){
    document.getElementById(id).classList.add("possibleMove");
}

export function removeSelected(){
	const possibleMoves = document.querySelectorAll('.selected');
  	possibleMoves.forEach(move => move.classList.remove('selected'));
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

export function displayHistory(coup, color){
    let Origine= document.getElementById("history").innerHTML;
    
    let rajout = "";
    if(color=="white"){
		turn++;
        rajout = `<div class="coups"><div class="turn">${turn}</div><div class="coupW">${coup}</div><div class="coupB"></div></div>`
    }
    else{
        //on enleve le </div> de la ligne précédente

        Origine = Origine.substring(0, Origine.length - 12);
		console.log
        rajout = `${coup}</div></div>`
    }

    document.getElementById("history").innerHTML = Origine + rajout;
}


export function promoting(id, futurePiece){
    //get the alt of the id
    let piece = document.getElementById(id).firstChild.alt;
    //get the 6first characcters of the piece
    let color = piece.substring(0, 5);
    
    document.getElementById(id).innerHTML = `<img src="public/pieces/${color}-${futurePiece}.png" alt="${color+futurePiece}" class="piece" >`;
}

export function displayBestMove(idStart, idEnd, color) {
	//delete the element with id line if it exists
	if(document.getElementById("line")){
		document.getElementById("line").remove();
	}
	//get state of button "button"
	let button = document.getElementById("button");
	// if it is checked
	if(button.checked){

	if (document.getElementById("pointStart")){
		document.getElementById("pointStart").remove();
	}
	
	if (document.getElementById("pointEnd")){
		document.getElementById("pointEnd").remove();
	}

	let start = document.getElementById(idStart);
	let end = document.getElementById(idEnd);
	
	let startRect = start.getBoundingClientRect();
	let endRect = end.getBoundingClientRect();
	
	let startX = startRect.left + startRect.width / 2;
	let endX = endRect.left + endRect.width / 2;
	let startY = startRect.top + startRect.height / 2;
	let endY = endRect.top + endRect.height / 2;
	
	var line = document.createElement("div");
	line.id = "line";
	line.style.pointerEvents = "none";
	line.style.position = "absolute";
	line.style.borderBottom = "3px solid red";
	line.style.backgroundColor = "blue";
	line.style.left = startX + "px";
	line.style.top = startY + "px";
	line.style.width = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) + "px";
	line.style.transformOrigin = "top left";
	line.style.transform = "rotate(" + Math.atan2(endY - startY, endX - startX) + "rad)";

	document.body.appendChild(line);
	}
}
displayBestMove("e2", "e4");


export function displayEndGame(color){
	//blur the board
	
	//get history div text
	let history = document.getElementById("history").innerHTML;
	//check if the history has a # char
	console.log(history)
	if(history.includes("#")){
		document.getElementById("body").classList.add("blur");
		//display the endgame div
		if(color == "white"){color = "blanc"}
		else{color = "noir"}
		document.getElementById("messageFin").innerHTML = "Echec et mat ! Les " + color + "s ont gagné !";
		let winMessage = document.getElementById('endGame')
		winMessage.classList.remove("hidden");
		winMessage.classList.add('priority');
		winMessage.style.display = "block";
	}
}
