let chessHTML = document.getElementById("board").children;

for (const element of chessHTML) {
	element.addEventListener("click", function() {
		console.log(element);
	});
}

fetch("/getPossibleMoves", {
	method: "POST",
	headers: {
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		"coordinates": 
})