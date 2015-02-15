Router.onAfterAction( loadGoogleAnalytics );
Router.onAfterAction( function() { 
	if (typeof window.ga !== 'undefined'){
		ga("send", "pageview", {'page': Router.current().path });
    }
});