var GameDisplay = function(size) {
	this.container = document.getElementById('container');
	this.container.onselectstart = this.container.ondragstart = function(event){
		event.preventDefault();
	};
	this.resultText = ['You lost! :(', 'It\'s a Draw!', 'You won!!! :)'];

	this.thinkingOverlay = document.getElementById('thinking-overlay');
	this.statusSayer = document.getElementById('statussayer');
	this.resultSayer = document.getElementById('resultsayer');
	this.retryButton = document.getElementById('retrybutton');
    this.currentSayer = document.getElementById('current-sayer');
    this.statusTable = document.getElementById('status-table');
    this.nextContainer = document.getElementById('nextsayer');
    this.nextContainer2 = document.getElementById('nextsayer2');
    this.nextSayer = document.getElementById('next-sayer');

    this.onClickHandler = this._onClickHandler.bind(this);
    this.onOverHandler = this._onOverHandler.bind(this);
    this.onOutHandler = this._onOutHandler.bind(this);

    this.current = 1;
    this.moveCallback = null;
    this.hoverCell = null;
    this.cellSize = this.tableSize = 0;
    this.doSetThinking = this.setThinking.bind(this, true);

    window.addEventListener('resize', this.updateSize.bind(this));
    this.remainingVerticalSpace = 160;
    this.desiredMargin = 15;
    this.cells = [];

    this.resize(size);
}
GameDisplay.prototype.initCells = function() {
	var hil = false, tmp;
	while(tmp=this.cells.pop()) {
		this.container.removeChild(tmp);
	}

	for (var row = 0; row < this.size; row++) {
		for (var column = 0; column < this.size; column++) {
			var newCell = document.createElement('span');
			if (hil)
				newCell.classList.add('hil');

			this.cells.push(newCell);
			newCell.addEventListener('mouseover', this.onOverHandler);
			newCell.addEventListener('mouseout', this.onOutHandler);
			newCell.addEventListener('click', this.onClickHandler);
			newCell.addEventListener('touchstart', this.onClickHandler);


			this.container.appendChild(newCell);
			hil = !hil;
		}
		if (this.size % 2 == 0)
			hil = !hil;
	};
	this.updateSize();
};
GameDisplay.prototype.updateBoard = function(board, lastMove) {
	for (var cell = 0; cell < board.length; cell++) {
		this.cells[cell].classList.remove('lastmove');
		this.cells[cell].textContent = board[cell] || '';
	};
	if (lastMove != -1) {
		this.cells[lastMove].classList.add('lastmove');
	}
};
GameDisplay.prototype.draw = function() {
	for(var t = 0; t < this.size2; t++) {
		this.cells[t].classList.remove('lastmove');
		this.cells[t].classList.add('draw');
	}
};
GameDisplay.prototype.highlightRow = function(row, reason) {
	//last move must be in this row, that's obvious
	for(var x = row[0], y = row[1], dx = row[2], dy = row[3]; x<this.size && 
		y<this.size; x += dx, y += dy) {
		this.cells[y*this.size + x].classList.remove('lastmove');
		this.cells[y*this.size + x].classList.add(reason?'winrow':'loserow');
	}
};
GameDisplay.prototype.setThinking = function(thinking) {
	this.thinkingOverlay.style.display = thinking?'block':'none';
	this.statusSayer.style.display = thinking?'block':'none';
};
GameDisplay.prototype.updateNext = function(current, next) {
	this.current = current;
	if (next) {
		this.nextContainer.style.visibility = 'visible';
		this.currentSayer.classList.add('active');
		this.nextSayer.classList.remove('active');
		this.currentSayer.textContent = current;
		this.nextSayer.textContent = next;
	} else {
		this.nextContainer.style.visibility = 'hidden';
		this.nextSayer.classList.add('active');
		this.nextSayer.textContent = current;
	}
};
GameDisplay.prototype.flipNext = function(current, next) {
	this.currentSayer.classList.remove('active');
	this.nextSayer.classList.add('active');
};
GameDisplay.prototype.setResult = function(result, row) {
	if (result)
		this.highlightRow(row, result==1?1:0);
	else
		this.draw();

	this.setThinking(false);
	this.statusTable.style.display = 'none';
	this.resultSayer.textContent = this.resultText[result+1];
	this.resultSayer.classList.remove('lose', 'draw', 'win');
	this.resultSayer.classList.add(result==1?'win':result?'lose':'draw');
	this.resultSayer.style.display = 'block';
	this.retryButton.style.display = 'block';
};
GameDisplay.prototype.reset = function() {
	this.setThinking(false);
	this.statusTable.style.display = 'table';
	this.resultSayer.style.display = 'none';
	this.retryButton.style.display = 'none';
	for (var t = 0; t < this.cells.length; t++) {
		this.cells[t].classList.remove('winrow', 'loserow', 'draw',
			 'hover', 'lastmove');
	};
};
GameDisplay.prototype.resize = function(size) {
	this.size = size;
	this.size2 = size*size;

	this.updateSize();
	this.initCells();
};
GameDisplay.prototype.resetCell = function(element) {
	element.classList.remove('hover');
	element.textContent = '';
}
GameDisplay.prototype._onOverHandler = function(event) {
	if (this.moveCallback && !event.target.textContent.length) {
		if (this.hoverCell) {
			this.resetCell(this.hoverCell);
		}
		event.target.textContent = this.current;
		event.target.classList.add('hover');
		this.hoverCell = event.target;
	}
};
GameDisplay.prototype._onOutHandler = function(event) {
	if (this.moveCallback && this.hoverCell) {
		this.resetCell(this.hoverCell);
		this.hoverCell = null;
	}
};
GameDisplay.prototype._onClickHandler = function(event) {
	if (this.moveCallback && (event.target == this.hoverCell ||
	 !event.target.textContent)) {
		var mc = this.moveCallback;
		if (this.hoverCell) {
			this.resetCell(this.hoverCell);
			this.hoverCell = null;
		}
		this.moveCallback = null;
		mc(this.cells.indexOf(event.target));
	}
};
GameDisplay.prototype.getNextMove = function(callback) {
	this.moveCallback = callback;
};
GameDisplay.prototype.updateSize = function() {
 var availableSpace = Math.min(innerWidth-this.desiredMargin,
  innerHeight-this.desiredMargin-155);

 this.cellSize = (availableSpace-2-2*this.size)/this.size | 0;
 this.tableSize = 2+this.size*(2+this.cellSize);
 this.container.style.width = this.tableSize+'px';
 document.getElementById('game-screen').style.width = this.tableSize+'px';
 document.getElementById('game-screen').style.height = this.tableSize+
 this.remainingVerticalSpace+'px';

 for (var t = 0; t < this.cells.length; t++) {
 	this.cells[t].style.width = this.cellSize+'px';
	this.cells[t].style.lineHeight =this.cells[t].style.height = this.cellSize+'px';
	this.cells[t].style.fontSize = Math.round(0.55*this.cellSize)+'px';
 };
}