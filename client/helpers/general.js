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


// function to update save loader status if package is available
updateSaveButton = function (type) {
  if (! SaveLoader) return;
  SaveLoader.saveAction(type); // requires save-loader package
};