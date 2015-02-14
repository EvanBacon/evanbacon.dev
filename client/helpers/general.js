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
  if (!! list && list.length > 0) {
    var url = list[0].thumb;
    _.each(list, function (i) {
       if(i.isFeatured === 1) {
          url = i.thumb;
       }
    });
    return url;
  } else {
    return '/img/placeholder.png';
  }
});

// function to update save loader status if package is available
updateSaveButton = function (type) {
  if (! SaveLoader) return;
  SaveLoader.saveAction(type); // requires save-loader package
};

// return true if count of a cursor is greater than 0
UI.registerHelper("hasCount", function(cursor) {
  if (!! cursor) {
    if(_.isArray(cursor)) 
      return cursor.length > 0;
    else
      return cursor.count() > 0;
  }
  return false;
    
});