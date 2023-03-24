import { removePossibleMoves, displayPossibleMoves } from './display.js';

function chessCoordinateToXY(chessCoord) {
	const file = chessCoord[0].toLowerCase().charCodeAt(0) - 97; // Convertit la lettre en un chiffre de 0 à 7 (a -> 0, b -> 1, etc.)
	const rank = parseInt(chessCoord[1]) - 1; // Convertit le chiffre après la lettre en un nombre de 0 à 7 (1 -> 0, 2 -> 1, etc.)
	return { x: file, y: rank };
}

function xyToChessCoordinate(xyObj) {
	const file = String.fromCharCode(97 + xyObj.x); // Convertit le chiffre x en une lettre de a à h
	const rank = xyObj.y + 1; // Convertit le nombre y en un chiffre de 1 à 8
	return file + rank;
}

export function getPossibleMoves(chessCoordinate){
	const {x , y} = chessCoordinateToXY(chessCoordinate);
	// Make a POST request to the server with the position information
	fetch('/getPossibleMoves', {	
		method: 'POST',
		headers: {
		'Content-Type': 'application/json'
		},
		body: JSON.stringify({ 
			x : x,
			y  : y,
		})
	})
		.then(res => res.json())
		.then(data => {
			console.log("remove possible moves");
			removePossibleMoves();

			data.forEach(element => {
				console.log(element);
				displayPossibleMoves(xyToChessCoordinate(element));
			});
		});
}