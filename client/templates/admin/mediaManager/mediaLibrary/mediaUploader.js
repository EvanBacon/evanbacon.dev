Template.mediaUploader.helpers({
  error: function () {
    return Session.get('add_media_error');
  },
  dataLoaded: function () {
    return Session.equals('is-uploading', 'true') ? false : true;
  }
});

Template.mediaUploader.events({
  // Catch the dropped event
  'change #fileselect, drop #dropzone': function ( e, t ) { 
      e.stopPropagation();
      e.preventDefault();
      $('#dropzone').removeClass('drag-in');
      $('#dropzone').removeClass('drag-hover');
      Submission.addFiles(e, function () {
        Session.set('is-uploading', false);
      });

   },
  'dragenter #dropzone': function (e, t) {
      e.stopPropagation();
      e.preventDefault();  
  },
  'dragleave #dropzone': function (e, t) {
      e.stopPropagation();
      e.preventDefault();
      $('#dropzone').removeClass('drag-in drag-hover');
  },
  'dragover #dropzone': function (e, t) {
      e.stopPropagation();
      e.preventDefault();

      $('#dropzone').addClass('drag-in');
      $('#dropzone').addClass('drag-hover');
  }
});


var Validation = {
    clear: function () {
      return Session.set("add_media_error", undefined);
    },
    set_error: function (message) {
      return Session.set("add_media_error", message);
    },
    valid_file: function (file) {
      this.clear();
      if ( file.type.indexOf("image") != 0 ) {
        this.set_error("One or more files are not allowed.");
        return false;
      } else {
        return true;
      }
    }
  };

var Submission = {
    addFiles: function(event, cb) {
        var self = this;
        var evt = (event.originalEvent || event);
        var files = evt.target.files;
        if (!files || files.length == 0)
          files = evt.dataTransfer ? evt.dataTransfer.files : [];

        var qty = files.length;
        var count = 0;

        FS.Utility.eachFile(event, function(file) {

         
         if (Validation.valid_file(file)) {
            count++;

            Session.set('is-uploading', 'true');
            var newFile = new FS.File(file);

            newFile.metadata = { 
                                 title: '',
                                 caption: ''
                                };

            Media.insert(newFile, function (err, fileObj) {
                if(err) {
                    Session.set('add_media_error', err);
                } else {
                   if(count >= qty) {
                     cb();
                   }
                }
              });
          }
        });
    }
};




