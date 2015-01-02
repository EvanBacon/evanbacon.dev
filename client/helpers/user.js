UI.registerHelper('isAdmin', function() {
  if(isAdmin(Meteor.user())){
    return true;
  } else {
    // if((typeof showError === "string") && (showError === "true"))
    //   console.log('Sorry, you do not have access to this page');
    return false;
  }
});