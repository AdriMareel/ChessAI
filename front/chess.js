

function getPossibleMoves(piece){
	//get the id of the div just above the piece
	div = document.getElementById(piece).parentNode.id;
	
	// Make a POST request to the server with the position information
	fetch('/getPossibleMoves', {
		
		method: 'POST',
		headers: {
		'Content-Type': 'application/json'
		},
		body: JSON.stringify({ 
			div,piece})
	})
		.then(res => res.json())
		.then(data => {
		// Interpret the response object and do something with it
		const { test, test2 } = data;
		console.log(`selectionned case are ${test} and ${test2}`);

		
		})
}