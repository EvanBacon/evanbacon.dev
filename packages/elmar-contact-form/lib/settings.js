var emailToSetting = {
	propertyName: 'emailTo',
	propertyGroup: 'general',
	propertySchema: {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Email,
		label: "E-mail To (address for contact inquiries)",
		autoform: {
			group: 'general'
		}
	}
};

SettingsSchemaAddOns.push(emailToSetting);
