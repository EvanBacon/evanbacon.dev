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
		// if(Meteor.isClient)
		// 	ErrorMsgs.throwError('Please fill in all required fields.');
		return false;
	},

	hasValidCharacters: function (value) {
		var filter = /[a-zA-Z0-9_\s+-]/;
		if (filter.test(value)) {
			return true;
		}
		// if( Meteor.isClient )
		// 	ErrorMsgs.throwError('Only alphanumeric characters, dashes, and underscores allowed.');
		return false;
	},

	isEmail: function(value, fieldName) {
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (filter.test(value)) {
			return true;
		}
		if (!fieldName)
			fieldName = 'email';
		// if(Meteor.isClient)
		// 	ErrorMsgs.throwError('Please enter a valid ' + fieldName + '.');
		return false;
	},

	isDate: function(value, fieldName) {
		// var filter = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
		var filter = /^[01]?[0-9]\/[0-3]?[0-9]\/[12][90][0-9][0-9]$/; 
		if (filter.test(value)) {
			return true;
		}
		if(!fieldName)
			fieldName = 'date';
		// if (Meteor.isClient)
		// 	ErrorMsgs.throwError('Please enter a valid ' + fieldName + '.');
		return false;
	},

	isShortTime: function(value, fieldName) {
		// var filter = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
		var filter = /^[0-1][0-2]\:[0-5][0-9]$/; 
		if (filter.test(value)) {
			return true;
		}
		// if(!fieldName)
		// 	fieldName = 'time';
		// if (Meteor.isClient)
		// 	ErrorMsgs.throwError('Please enter a valid ' + fieldName + '.');
		return false;
	},

	

	isURL: function(value) {
		var filter = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/;
	  if(!filter.test(value)) {
	  	// if(Meteor.isClient)
	   //  	ErrorMsgs.throwError("Please enter a valid URL.");
	    return false;
	  } else {
	    return true;
	  }
	}

}

