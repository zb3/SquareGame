var GameSettings = function(callback) {
	var _this = this;

	this.callback = callback;

	this.boardSizeSelect = document.getElementById('settings-boardsize');
	this.modulusSelect = document.getElementById('settings-modulus');
	this.difficultySelect = document.getElementById('settings-difficulty');
	this.whoStartsSelect = document.getElementById('settings-whostarts');

	this.boardSizeSelect.addEventListener('change', function(){
		if (_this.boardSizeSelect.selectedIndex == 0) {
			_this.modulusSelect.selectedIndex = 1;
		} else if (_this.boardSizeSelect.selectedIndex == 1) {
			_this.modulusSelect.selectedIndex = 5;
		}
		callback();
	});
	this.modulusSelect.addEventListener('change', callback);
	this.difficultySelect.addEventListener('change', callback);
	this.whoStartsSelect.addEventListener('change', callback);
};
GameSettings.prototype.readSettings = function() {
	var settings = {};
	settings.size = this.boardSizeSelect.selectedIndex+3;
	settings.modulus = this.modulusSelect.selectedIndex+3;
	settings.AIDepth = this.difficultySelect.selectedIndex+3;
	settings.userFirst = !this.whoStartsSelect.selectedIndex;
	settings.randomizeFirst = this.whoStartsSelect.selectedIndex == 2;

	return settings;
};
GameSettings.prototype.displaySettings = function(settings) {
	this.boardSizeSelect.selectedIndex = settings.size-3;
	this.modulusSelect.selectedIndex = settings.modulus-3;
	this.difficultySelect.selectedIndex = settings.AIDepth-3;

	if (settings.userFirst) {
		this.whoStartsSelect.selectedIndex = 0;
	} else if (settings.randomizeFirst) {
		this.whoStartsSelect.selectedIndex = 2;
	} else {
		this.whoStartsSelect.selectedIndex = 1;
	}
};