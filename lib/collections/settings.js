

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
	loadingAddOnUrl: {
		type: String,
		label: 'Loading Image Url (background for spinner)',
		optional: true,
		autoform: {
			group: 'styling'
		}
	},
	imageMaxSize: {
		type: Number,
		optional: true,
		label: "Maximum image size allowed (bytes)",
		autoform: {
			group: 'styling'
		},
		max: 2000000
	},
	imageMaxWidth: {
		type: Number,
		optional: true,
		label: "Maximum image width allowed (pixels)",
		autoform: {
			group: 'styling'
		},
		max: 1400
	},
	imageWidthThumb: {
		type: Number,
		optional: true,
		label: "Thumbnail Width (pixels)",
		autoform: {
			group: 'styling',
			instructions: 'Default width of a thumbnail image'
		}
	},
	imageWidthMedium: {
		type: Number,
		optional: true,
		label: "Medium Image Width (pixels)",
		autoform: {
			group: 'styling',
			instructions: 'Default width of a medium-sized image'
		}
	},
	imageWidthLarge: {
		type: Number,
		optional: true,
		label: "Large Image Width (pixels)",
		autoform: {
			group: 'styling',
			instructions: 'Default width of a large-sized image'
		}
	},
	imageThumbPath: {
		type: String,
		optional: true,
		label: "Path to Thumbnails Folder",
		autoform: {
			group: 'styling',
			instructions: '/cfs/files/'
		}
	},
	// imagesPath: {
	// 	type: String,
	// 	optional: true,
	// 	label: "Path to Images Bucket or Folder",
	// 	autoform: {
	// 		group: 'styling',
	// 		instructions: '//images.elmarcreative.com/assets/'
	// 	}
	// },
	
	headerColor: {
		type: String,
		optional: true,
		autoform: {
			group: 'colors'
		}
	},
	headerTextColor: {
		type: String,
		optional: true,
		autoform: {
			group: 'colors'
		}
	},
	// googleAnalyticsId: {
	// 	type: String,
	// 	optional: true,
	// 	autoform: {
	// 		group: 'integrations'
	// 	}
	// },
	footerCode: {
		type: String,
		optional: true,
		autoform: {
			group: 'extras',
			instructions: 'Footer content (accepts HTML).',
			rows: 5
		}
	},
	extraCode: {
		type: String,
		optional: true,
		autoform: {
			group: 'extras',
			instructions: 'Any extra HTML code you want to include on every page.',
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
