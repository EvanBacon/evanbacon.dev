MediaLibrary = {
	appendToFileName: function (filename, str) {
		var parts = filename.split('.');
		var ext = parts.pop();
		return parts.join('.') + str + '.' + ext;
	}

};