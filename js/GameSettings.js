var GameSettings = function(callback) {
	var _this = this;

	this.callback = callback;

	this.customSizeSettings = document.getElementById('settings-customsize');
	this.boardSizeSelect = document.getElementById('settings-boardsize');
	this.modulusSelect = document.getElementById('settings-modulus');
	this.difficultySelect = document.getElementById('settings-difficulty');
	this.whoStartsSelect = document.getElementById('settings-whostarts');

	this.customSizeSettings.addEventListener('change', callback);
	this.boardSizeSelect.addEventListener('change', callback);
	this.modulusSelect.addEventListener('change', callback);
	this.difficultySelect.addEventListener('change', callback);
	this.whoStartsSelect.addEventListener('change', callback);

	this.typeSelect = document.getElementById('settings-gametype');

	this.typeSelect.addEventListener('change', function(){
		 	_this.customSizeSettings.style.display =
		 		 (_this.typeSelect.selectedIndex == 4)?'block':'none';
		 	callback();
	});
};
GameSettings.prototype.readSettings = function() {
	var settings = {};
	if (!this.typeSelect.selectedIndex) {
		settings.size = 3;
		settings.modulus = 4;
	} else if (this.typeSelect.selectedIndex == 1) {
		settings.size = 4;
		settings.modulus = 4;
	} else if (this.typeSelect.selectedIndex == 2) {
		settings.size = 4;
		settings.modulus = 8;
	} else if (this.typeSelect.selectedIndex == 3) {
		settings.size = 5;
		settings.modulus = 9;
	} else {
		settings.size = this.boardSizeSelect.selectedIndex+3;
		settings.modulus = this.modulusSelect.selectedIndex+3;
	}
	settings.AIDepth = this.difficultySelect.selectedIndex+3;
	settings.userFirst = !this.whoStartsSelect.selectedIndex;
	settings.randomizeFirst = this.whoStartsSelect.selectedIndex == 2;

	return settings;
};
GameSettings.prototype.displaySettings = function(settings) {
	var isCustom = false;

	if (settings.size == 3 && settings.modulus == 4) {
		this.typeSelect.selectedIndex = 0;
	} else if (settings.size == 4 && settings.modulus == 4) {
		this.typeSelect.selectedIndex = 1;
	} else if (settings.size == 4 && settings.modulus == 8) {
		this.typeSelect.selectedIndex = 2;
	} else if (settings.size == 5 && settings.modulus == 9) {
		this.typeSelect.selectedIndex = 3;
	} else {
		isCustom = true;
		this.typeSelect.selectedIndex = 4;
		this.boardSizeSelect.selectedIndex = settings.size-3;
		this.modulusSelect.selectedIndex = settings.modulus-3;
	}

	this.customSizeSettings.style.display = isCustom?'block':'none';

	this.difficultySelect.selectedIndex = settings.AIDepth-3;
	if (settings.userFirst) {
		this.whoStartsSelect.selectedIndex = 0;
	} else if (settings.randomizeFirst) {
		this.whoStartsSelect.selectedIndex = 2;
	} else {
		this.whoStartsSelect.selectedIndex = 1;
	}
};