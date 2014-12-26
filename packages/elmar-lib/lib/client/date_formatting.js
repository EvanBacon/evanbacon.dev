DateFormatting = {
	getTimeString: function (date) {
	  if (moment) {
	      var minutes = moment(date).minutes();
	      var hours = moment(date).hours() % 12;
	      hours = (hours === 0) ? 12 : hours;
	      return Math.floor(hours / 10).toString() + (hours % 10).toString() + ':' + Math.floor(minutes / 10).toString() + (minutes % 10).toString();
	  }
	},
	getAMPMString: function (date) {
	  if (moment) {
	      return moment(date).format('A');
	  }
	}

}