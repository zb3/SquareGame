var Game = function(size, modulus) {
	this.n = size;
	this.n2 = size*size;
	this.modulus = modulus;
	this.board = [];
	this.currentNumber = 1;

	for (var t = 0; t < this.n2; t++) {
		this.board[t] = 0;
	};
};
Game.prototype.getNext = function() {
	return (this.currentNumber % this.modulus) + 1;
};
Game.prototype.makeMove = function(position) {
	this.board[position] = this.currentNumber;
	this.currentNumber = (this.currentNumber % this.modulus) + 1;
};
Game.prototype.undoMove = function(position) {
	this.board[position] = 0;
	this.currentNumber = ((this.modulus + this.currentNumber - 2) % this.modulus) + 1;
};
Game.prototype.checkWin = function(wantCoords) {
	var c, r, d, sum;

	vertical: for (c = 0; c < this.n; c++) {
		for (r = 0, sum = 0; r < this.n; r++) {
			if (!this.board[r*this.n+c])
				continue vertical;

			sum += this.board[r*this.n+c];
		}
		if (Math.sqrt(sum)%1 == 0) {
			return wantCoords?[c, 0, 0, 1]:true;
		}
	};

	horizontal: for (r = 0; r < this.n; r++) {
		for (c = 0, sum = 0; c < this.n; c++) {
			if (!this.board[r*this.n+c])
				continue horizontal;

			sum += this.board[r*this.n+c];
		}
		if (Math.sqrt(sum)%1 == 0) {
			return wantCoords?[0, r, 1, 0]:true;
		}
	};

	for (d = 0, sum = 0; d < this.n; d++) {
		if (!this.board[d*this.n+d]) {
			sum = 2; //ultimate laziness
			break;
		}
		sum += this.board[d*this.n+d];
	}
	if (Math.sqrt(sum)%1 == 0) {
		return wantCoords?[0, 0, 1, 1]:true;
	}

	for (d = 0, sum = 0; d < this.n; d++) {
		if (!this.board[d*this.n+this.n-d-1]) {
			sum = 2;
			break;
		}
		sum += this.board[d*this.n+this.n-d-1];
	}
	if (Math.sqrt(sum)%1 == 0) {
		return wantCoords?[this.n-1, 0, -1, 1]:true;
	}
};
Game.prototype.isMoveLegal = function(position) {
	return !this.board[position];
};
Game.prototype.movesLeft = function() {
	for (var t = 0; t < this.board.length; t++) {
		if (this.board[t] == 0)
			return true;
	}
	return false;
};
