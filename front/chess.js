import { removePossibleMoves, displayPossibleMoves } from './display.js';

function chessCoordinateToXY(chessCoord) {
	const file = chessCoord[0].toLowerCase().charCodeAt(0) - 97; 
	const rank = parseInt(chessCoord[1]) - 1; 
	return { x: file, y: rank };
}

function xyToChessCoordinate(xyObj) {
	const file = String.fromCharCode(97 + xyObj.x); 
	const rank = xyObj.y + 1; 
	return file + rank;
}

export function getPossibleMoves(chessCoordinate){
	const {x , y} = chessCoordinateToXY(chessCoordinate);
	
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
			removePossibleMoves();

			data.forEach(element => {
				console.log(element);
				displayPossibleMoves(xyToChessCoordinate(element));
			});
		});
}