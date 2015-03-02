

var settingsSchema = {
	title: {
		type: String,
		label: "Site Title",
		optional: true,
		autoform: {
		   group: 'general'
	    }
	},
	siteDescription: {
		type: String,
		label: "Site Description",
		optional: true,
		autoform: {
		   group: 'general',
		   rows: 2
	    }
	},
	mediaPerPage: {
		type: Number,
		defaultValue: 30,
		optional: true,
		autoform: {
			group: 'Media'
		}
	},
	logoUrl: {
		type: String,
		optional: true,
		label: "Logo URL (upload logo to image library and get URL by clicking on logo thumbnail)",
		autoform: {
			group: 'logo'
		}
	},
	logoHeight: {
		type: Number,
		optional: true,
		autoform: {
			group: 'logo'
		},
		max: 100
	},
	logoWidth: {
		type: Number,
		optional: true,
		autoform: {
			group: 'logo'
		}
	},
	faviconUrl: {
		type: String,
		optional: true,
		label: "Favicon URL (upload favicon to image library and get URL by clicking on favicon thumbnail)",
		autoform: {
			group: 'logo'
		}
	},
	backgroundUrl: {
		type: String,
		label: "Background URL (upload bg to image library and get URL by clicking on bg thumbnail)",
		optional: true,
		autoform: {
			group: 'styling'
		}
	},
	imageMaxSize: {
		type: Number,
		optional: true,
		defaultValue: 500000,
		label: "Maximum image size allowed (bytes)",
		autoform: {
			group: 'styling'
		},
		max: 2000000
	},
	imageMaxWidth: {
		type: Number,
		optional: true,
		defaultValue: 1200,
		label: "Maximum image width allowed (pixels)",
		autoform: {
			group: 'styling'
		},
		max: 1400
	},
	imageWidthThumb: {
		type: Number,
		optional: true,
		defaultValue: 250	,
		label: "Thumbnail Width (pixels)",
		autoform: {
			group: 'styling',
			instructions: 'Default width of a thumbnail image'
		}
	},
	imageWidthMedium: {
		type: Number,
		optional: true,
		defaultValue: 450,
		label: "Medium Image Width (pixels)",
		autoform: {
			group: 'styling',
			instructions: 'Default width of a medium-sized image'
		}
	},
	imageWidthLarge: {
		type: Number,
		optional: true,
		defaultValue: 900,
		label: "Large Image Width (pixels)",
		autoform: {
			group: 'styling',
			instructions: 'Default width of a large-sized image'
		}
	},
	numberSamplesFromAlbum: {
		type: Number,
		optional: true,
		defaultValue: 3,
		label: "Number Sample Images From Album (to display on Albums page)",
		autoform: {
			group: 'styling',
		}
	},
	aboutCode: {
		type: String,
		optional: true,
		autoform: {
			group: 'extras',
			instructions: 'About content (accepts HTML).',
			rows: 15
		}
	},
	footerCode: {
		type: String,
		optional: true,
		autoform: {
			group: 'extras',
			instructions: 'Footer content (accepts HTML).',
			rows: 5
		}
	}
};

// add any extra properties
_.each(SettingsSchemaAddOns, function(item){
	settingsSchema[item.propertyName] = item.propertySchema;
});

Settings.attachSchema(settingsSchema);

Settings.allow({
	insert: isAdminById,
	update: isAdminById,
	remove: isAdminById
});
