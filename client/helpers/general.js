var DateFormats = {
       short: "MMMM DD, YYYY",
       long: "lll"
};

UI.registerHelper("formatDate", function(datetime, format) {
  if (moment) {
    f = DateFormats[format];
    return moment(datetime).format(f);
  }
  else {
    return datetime;
  }
});

UI.registerHelper("getFeaturedUrl", function(mediaList) {
   var url = mediaList[0].thumb;
   _.each(mediaList, function (m) {
       if(m.isFeatured === 1) {
          url = m.thumb;
       }
  });
  return url;
});


// function to update save loader status if package is available
updateSaveButton = function (type) {
  if (! SaveLoader) return;
  SaveLoader.saveAction(type); // requires save-loader package
};