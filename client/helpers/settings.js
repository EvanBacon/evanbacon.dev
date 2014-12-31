// a place to store temporary preference settings for the client
ClientSettings = new Meteor.Collection(null);

// addClientSetting = function(name, value) {  
// 	ClientSettings.insert({'setting': name, 'value': value });
// };

removeClientSetting = function(name) {  
	ClientSettings.remove({'setting': name});
};

getClientSetting = function(name) {
	var setting = ClientSettings.findOne({'setting': name});
	if (!! setting)
		return setting.value;
};

setClientSetting = function(name, value) {
	if (! ClientSettings.findOne({'setting': name})) {
		ClientSettings.insert({'setting': name, 'value': value });
	} else {
		ClientSettings.update({'setting': name}, { $set: { 'value': value }});
	}
};