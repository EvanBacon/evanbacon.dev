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

UI.registerHelper("getFeaturedUrl", function(list) {
  if (!! list) {
    var url = list[0].thumb;
    _.each(list, function (i) {
       if(i.isFeatured === 1) {
          url = i.thumb;
       }
    });
    return url;
  }
});


// getGalleryType = function () {
//   var page = Router.current().route.getName();
//   if (page === 'mediaManager')
//     return 'gallery';
//   if (page === 'galleryManager')
//     return 'albu'

// };

// function to update save loader status if package is available
updateSaveButton = function (type) {
  if (! SaveLoader) return;
  SaveLoader.saveAction(type); // requires save-loader package
};