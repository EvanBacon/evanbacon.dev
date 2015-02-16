Router.onAfterAction( loadGoogleAnalytics );
Router.onAfterAction( function() { 
	if (typeof ga !== 'undefined'){
		ga("send", "pageview", {'page': Router.current().location.get().path });
    }
});