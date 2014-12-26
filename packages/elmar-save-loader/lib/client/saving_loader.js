SaveLoader = {
	saveAction: function (type) {
		// Codes: 'reset', 'error', 'wait', 'complete'
		type = type.toLowerCase();
		if (type === 'reset') {
			$('.saveload').fadeIn().removeClass('hidden');
			$('.wait').addClass('hidden');
			$('.saved').addClass('hidden'); 
			$('.notsaved').addClass('hidden');
			$('.saveload').text(this.text);
		}
		if (type === 'wait') {
			$('.saveload').addClass('hidden'); 
			$('.wait').fadeIn().removeClass('hidden');
			$('.saved').addClass('hidden'); 
			$('.notsaved').addClass('hidden');
		}
		if (type === 'error') {
			$('.saveload').addClass('hidden'); 
			$('.wait').addClass('hidden');
			$('.saved').addClass('hidden'); 
			$('.notsaved').fadeIn().removeClass('hidden'); 
		}
		if (type === 'complete') {
			$('.saveload').addClass('hidden'); 
			$('.wait').addClass('hidden');
			$('.saved').fadeIn().removeClass('hidden'); 
			$('.notsaved').addClass('hidden');
		}
	}
}


