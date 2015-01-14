var googleAnalyticsSetting = {
	propertyName: 'googleAnalyticsId',
	propertyGroup: 'analytics',
	propertySchema: {
		type: String,
		optional: true,
		label: 'Google Analytics ID',
		autoform: {
			group: 'analytics'
		}
	}
};

SettingsSchemaAddOns.push(googleAnalyticsSetting);
