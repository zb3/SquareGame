var SquareGame = function() {
	this.gameAI = null;
	this.settingsStorage = new GameStorage('SquareGame');

	this.settings = {
		size: 3,
		modulus: 4,
		userFirst: false,
		randomizeFirst: true,
		AIDepth: 6
	};

	if (this.settingsStorage.hasItem('settings')) {
		this.settings = this.settingsStorage.getItem('settings');
	}

	this.settingsUI = new GameSettings(this.updateSettings.bind(this));
	this.settingsUI.displaySettings(this.settings);

	this.display = new GameDisplay(this.settings.size);
	this.onUserInput = this._onUserInput.bind(this);
	this.afterCPUMove = this._afterCPUMove.bind(this);

	this.thinkingTimeout;

	var _this = this;

	document.getElementById('retrybutton').onclick = 
	document.getElementById('newgame').onclick = function() {
		_this.newGame();
	};
	document.getElementById('continuegame').onclick = function() {
		_this.showGame();
	};
	document.getElementById('back-to-menu').onclick = function() {
		_this.hideGame();
	};
};
SquareGame.prototype.updateDisplay = function(cpuMove, firstMove) {
	this.display.updateBoard(this.game.board, this.lastMove);
	if (cpuMove && !firstMove) {
		this.display.flipNext();
	} else if (cpuMove && firstMove) {
		this.display.updateNext(this.game.currentNumber);
	} else {
		this.display.updateNext(this.game.currentNumber, this.game.getNext());
	}
};
SquareGame.prototype.updateSettings = function() {
	this.settings = this.settingsUI.readSettings();
	this.settingsStorage.setItem('settings', this.settings);
};
SquareGame.prototype.newGame = function() {
	clearTimeout(this.thinkingTimeout);
	this.lastMove = -1;

	this.settings = this.settingsUI.readSettings();

	this.game = new Game(this.settings.size, this.settings.modulus);
	this.display.resize(this.settings.size);
	this.display.reset();

	if (this.gameAI) {
		this.gameAI.terminate();
	}
	this.gameAI = new Worker('js/GameAIWorker.js');
	this.gameAI.postMessage(this.settings.AIDepth);

	this.gameAI.onmessage = this.afterCPUMove;

	this.updateDisplay(!this.settings.userFirst, true);
	this.showGame();

	if (!this.settings.userFirst) {
		if (this.settings.randomizeFirst) {
			this.afterCPUMove({data: Math.random()*this.game.n2|0});
		} else {
			this.thinkingTimeout = setTimeout(this.display.doSetThinking, 50);
			this.gameAI.postMessage(this.game);
		}
	}
	else
		this.waitForMove();

};
SquareGame.prototype.setResult = function(result, row) {	
	document.getElementById('continue-game').style.display = 'none';
	this.display.setResult(result, row);
};
SquareGame.prototype._onUserInput = function(move) {
	this.lastMove = move;
	this.game.makeMove(move);
	this.updateDisplay(true);

	var winRow = this.game.checkWin(true);
	if (winRow) {
		this.setResult(1, winRow);
	}
	else if (!this.game.movesLeft()) {
		this.setResult(0);
	}
	else {
		this.thinkingTimeout = setTimeout(this.display.doSetThinking, 50);
		this.gameAI.postMessage(this.game);
	}
};
SquareGame.prototype._afterCPUMove = function(message) {
	clearTimeout(this.thinkingTimeout);
	this.lastMove = message.data;
	this.game.makeMove(this.lastMove);
	this.display.setThinking(false);
	this.updateDisplay();

	var loseRow = this.game.checkWin(true);
	if (loseRow) {
		this.setResult(-1, loseRow);
	}
	else if (!this.game.movesLeft()) {
		this.setResult(0);
	}
	else {
		this.waitForMove();
	}
};
SquareGame.prototype.waitForMove = function() {
	this.display.getNextMove(this.onUserInput);
};
SquareGame.prototype.showGame = function() {
	document.getElementById('settings-screen').style.display = 'none';
	document.getElementById('continue-game').style.display = 'block';
	document.getElementById('game-screen').style.display = '';
};
SquareGame.prototype.hideGame = function() {
	document.getElementById('settings-screen').style.display = 'block';
	document.getElementById('game-screen').style.display = 'none';
};