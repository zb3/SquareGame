var GameStorage = function(prefix) {
	this.prefix = prefix;
};
GameStorage.prototype.hasItem = function(name) {
	return !(localStorage.getItem(this.prefix+name) === null);
};
GameStorage.prototype.getItem = function(name) {
	if (this.hasItem(name)) {
		return JSON.parse(localStorage.getItem(this.prefix+name));
	}
	return null;
};
GameStorage.prototype.setItem = function(name, value) {
	return localStorage.setItem(this.prefix+name, JSON.stringify(value));
};