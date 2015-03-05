importScripts('Game.js', 'GameAI.js');
var instance = null;
onmessage = function(e) {
	console.log();
	if (!instance) {
		instance = new GameAI(e.data);
	} else {
		postMessage(instance.bestMove(e.data));
	}
}