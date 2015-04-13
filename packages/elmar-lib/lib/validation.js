Validation = {
	trimInput: function(value) {
		if (value)
			return value.replace(/^\s*|\s*$/g, '');
		else return null;
	},

	isNotEmpty: function(value) {
		if (value && value !== ''){
			return true;
		}
		return false;
	},

	hasValidCharacters: function (value) {
		var filter = /[a-zA-Z0-9_\s+-]/;
		if (filter.test(value)) {
			return true;
		}
		return false;
	},

	isEmail: function(value) {
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (filter.test(value)) {
			return true;
		}
		return false;
	},
	

	isURL: function(value) {
		var filter = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/;
	  if(!filter.test(value)) {
	    return false;
	  } else {
	    return true;
	  }
	}

}

