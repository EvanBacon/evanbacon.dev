UI.registerHelper('isAdmin', function() {
  return isAdmin(Meteor.user());
});

UI.registerHelper("isAdminAlbum", function(list) {
  return isAdmin(Meteor.user()) && Router.current().route.getName() === 'albumManager';
});