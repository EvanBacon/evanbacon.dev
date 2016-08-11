

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
	facebookUrl: {
		type: String,
		optional: true,
		label: "Link to your Facebook Account",
		autoform: {
			group: 'social'
		}
	},
	twitterUrl: {
		type: String,
		optional: true,
		label: "Link to your Twitter Account",
		autoform: {
			group: 'social'
		}
	},
	instagramUrl: {
		type: String,
		optional: true,
		label: "Link to your Instagram Account",
		autoform: {
			group: 'social'
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
		label: "Number Sample Images From Album (to display on Works page)",
		autoform: {
			group: 'styling',
		}
	},
	aboutCode: {
		type: String,
		optional: true,
		autoform: {
			group: 'about',
			instructions: 'About content (accepts HTML).',
			rows: 15
		}
	},
	aboutImageURL: {
		type: String,
		optional: true,
		autoform: {
			group: 'about',
			instructions: 'About Image URL',
		}
	},
	philosophyCode: {
		type: String,
		optional: true,
		autoform: {
			group: 'philosophy',
			instructions: 'Philosophy content (accepts HTML).',
			rows: 15
		}
	},
	philosophyImageURL: {
		type: String,
		optional: true,
		autoform: {
			group: 'philosophy',
			instructions: 'Philosophy Image URL',
		}
	},

	atelierCode: {
		type: String,
		optional: true,
		autoform: {
			group: 'extras',
			instructions: 'Atelier content (accepts HTML).',
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
