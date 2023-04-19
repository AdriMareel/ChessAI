import { removePossibleMoves, displayPossibleMoves, toggleMoveMode, untoggleMoveMode, displayMove, isCheck, clearCheck, removeSelected, displaySelected } from './displayVersusAI.js';

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
	removeSelected();
	displaySelected(chessCoordinate)
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

export function move(chessCoordinatePrevious, chessCoordinateNext) {
	removeSelected();
	const { x, y } = chessCoordinateToXY(chessCoordinatePrevious);
	const { x: xNext, y: yNext } = chessCoordinateToXY(chessCoordinateNext);

	console.warn('MOVE');
	console.log(chessCoordinatePrevious, chessCoordinateNext);

	if (document.getElementById(chessCoordinatePrevious).firstChild.alt.match("king")) {
		//take the 6 first char of the first child alt
		//if it's "white" it's a white king
		//if it's "black" it's a black king
		//let color = document.getElementById(chessCoordinatePrevious).firstChild.alt.slice(0, 5) 

		console.log("roi bougé", chessCoordinatePrevious, chessCoordinateNext)

		let chessCoordinatePreviousR
		let chessCoordinateNextR
		chessCoordinateNextR = ""

		//si le roque est petit
		let roque = false
		if (xNext - x == 2) {
			chessCoordinatePreviousR = "h" + chessCoordinatePrevious.slice(1, 2)
			chessCoordinateNextR = "f" + chessCoordinateNext.slice(1, 2)
			//on bouge la tour		
			roque = true
		}
		//si le roque est grand
		else if (x - xNext == 2) {
			//on bouge la tour		
			roque = true
			chessCoordinatePreviousR = "a" + chessCoordinatePrevious.slice(1, 2)
			chessCoordinateNextR = "d" + chessCoordinateNext.slice(1, 2)
		}
		if (roque) {
			displayMove(chessCoordinatePreviousR, chessCoordinateNextR);

		}
	}

	fetch('/movePiece', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			x: x,
			y: y,
			xNext: xNext,
			yNext: yNext,
		})
	})
		.then(res => res.json())
		.then(data => {
			untoggleMoveMode();
			clickedPiece = null;
			displayMove(chessCoordinatePrevious, chessCoordinateNext);
		});

	fetch('/isChecked', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(),
	})
		.then(res => res.json())
		.then(data => {
			//data is send with black and white parameter containing true or false
			//if true, it's check
			//if false, it's not check
			console.log("isCheck", data)
			//read "black" and "white" parameter from object
			let blackCheck = data.black
			let whiteCheck = data.white
			clearCheck()
			if (whiteCheck) { isCheck("white") }
			if (blackCheck) { isCheck("black") }
		});


	fetch('/playAI', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(),
	})
		.then(res => res.json())
		.then(data => {
			console.log("AI played", data);
			displayMove(data.start, data.end);
		});

		fetch('/isChecked', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(),
		})
			.then(res => res.json())
			.then(data => {
				//data is send with black and white parameter containing true or false
				//if true, it's check
				//if false, it's not check
				console.log("isCheck", data)
				//read "black" and "white" parameter from object
				let blackCheck = data.black
				let whiteCheck = data.white
				clearCheck()
				if (whiteCheck) { isCheck("white") }
				if (blackCheck) { isCheck("black") }
			});


			fetch('/evaluation', {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
			})
				.then(res => res.json())
				.then(data => {
					if (data.score.type == "mate"){
						document.getElementById("evaluation").innerHTML = "M" + data.score.value;
					}
					else{
						document.getElementById("evaluation").innerHTML = data.score;
					}
				});
}
