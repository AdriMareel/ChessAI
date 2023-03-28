import { removePossibleMoves, displayPossibleMoves, toggleMoveMode, untoggleMoveMode, displayMove } from './display.js';

export let clickedPiece = null;

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
	clickedPiece = chessCoordinate;
	console.warn('GET POSSIBLE MOVES');
	

	const {x , y} = chessCoordinateToXY(chessCoordinate);
	
	fetch('/getPossibleMoves', {	
		method: 'POST',
		headers: {
		'Content-Type': 'application/json'
		},
		body: JSON.stringify({ 
			x : x,
			y : y,
		})
	})
		.then(res => res.json())
		.then(data => {
			removePossibleMoves();

			data.forEach(element => {
				console.log(element);
				displayPossibleMoves(xyToChessCoordinate(element));
				toggleMoveMode();
			});
		});
}

export function move(chessCoordinatePrevious, chessCoordinateNext){

	
	const {x , y} = chessCoordinateToXY(chessCoordinatePrevious);
	const {x : xNext , y : yNext} = chessCoordinateToXY(chessCoordinateNext);
	
	console.warn('MOVE');
	console.log(chessCoordinatePrevious, chessCoordinateNext);

	//si la piece bougée est un roi et qu'il s'agit d'un roque
	console.log("piece bougée", chessCoordinatePrevious)
	//first child alt contain "king"
	if(document.getElementById(chessCoordinatePrevious).firstChild.alt.match("king")){
		//take the 6 first char of the first child alt
		//if it's "white" it's a white king
		//if it's "black" it's a black king
		//let color = document.getElementById(chessCoordinatePrevious).firstChild.alt.slice(0, 5) 
		
		console.log("roi bougé", chessCoordinatePrevious, chessCoordinateNext)

		let chessCoordinatePreviousR 
		let chessCoordinateNextR
		chessCoordinateNextR = ""
		console.log("roque")
		//si le roque est petit
		let roque=false
		if(xNext - x == 2){
			chessCoordinatePreviousR = "h" + chessCoordinatePrevious.slice(1, 2)
			chessCoordinateNextR = "f" + chessCoordinateNext.slice(1, 2)
			//on bouge la tour
			console.log("petit roque")
			roque = true
		}
		//si le roque est grand
		else if(x - xNext == 2){
			//on bouge la tour
			console.log("grand roque")
			roque = true
			chessCoordinatePreviousR = "a" + chessCoordinatePrevious.slice(1, 2)
			chessCoordinateNextR = "d" + chessCoordinateNext.slice(1, 2)

			
		}
		if(roque==true){

			const {x , y} = chessCoordinateToXY(chessCoordinatePreviousR);
			const {x : xNext , y : yNext} = chessCoordinateToXY(chessCoordinateNextR);
			console.log("tour bougée",)
			fetch('/movePiece', {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					x : x,
					y : y,
					xNext : xNext,
					yNext : yNext,
				})
			})
				.then(res => res.json())
				.then(data => {
					untoggleMoveMode();
					clickedPiece = null;
					displayMove(chessCoordinatePreviousR, chessCoordinateNextR);
				});
		}

	}
	


	fetch('/movePiece', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			x : x,
			y : y,
			xNext : xNext,
			yNext : yNext,
		})
	})
		.then(res => res.json())
		.then(data => {
			untoggleMoveMode();
			clickedPiece = null;
			displayMove(chessCoordinatePrevious, chessCoordinateNext);
		});
		


	
}