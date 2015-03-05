var GameAI = function(depth) {
	this.depth = depth || 9;
};
GameAI.prototype.moveScore = function(game, depth, alpha, beta, returnMove) {
	if (Game.prototype.checkWin.call(game))
		return -1/depth;
	if (depth == this.depth || !Game.prototype.movesLeft.call(game))
		return 0;

	var bestMove, bestScore = -2, score;
	for(var move=0; move<game.n2; move++) {

		if (game.board[move]) continue;

		Game.prototype.makeMove.call(game, move);
		score = -this.moveScore(game, depth+1, -beta, -alpha);
		Game.prototype.undoMove.call(game, move);

		alpha = Math.max(alpha, score);
		if (score > bestScore) {
			bestScore = score;
			bestMove = move;			
		}

		if (alpha >= beta)
			break;
	}
	return returnMove?bestMove:bestScore;
};
GameAI.prototype.bestMove = function(game) {
	return this.moveScore(game, 0, -Infinity, Infinity, true);
};
