module.exports.resetGame = (req, res, next) => {
	let game = req.game;
	game.reset();
	next();
};