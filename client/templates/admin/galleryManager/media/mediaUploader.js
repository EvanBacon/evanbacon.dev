Template.mediaUploader.onRendered(function () {
  Validation.clear();
});

Template.mediaUploader.helpers({
  error: function () {
    return Session.get('add_media_error');
  }
});

Template.mediaUploader.events({
  // Catch the dropped event
  'change #fileselect, drop #dropzone': function (e, t) { 
      e.stopPropagation();
      e.preventDefault();
      Validation.clear();
      Submission.addFiles(e, function () {
        $('#dropzone').removeClass('drag-in');
        $('#dropzone').removeClass('drag-hover');
      });
  },
  'click .close': function (e) {
      Validation.clear();
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
      Session.set("add_media_error", message);
      $('#dropzone').removeClass('drag-in');
      $('#dropzone').removeClass('drag-hover');
    },
    valid_file: function (file) {
      this.clear();
      if ( file.type.indexOf("image") != 0 ) {
        this.set_error("One or more file types are not allowed.");
        return false;
      } else {
        return true;
      }
    }
};

var Submission = {
    addFiles: function(event, next) {
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

              var newFile = new FS.File(file);

              newFile.metadata = { 
                                   title: '',
                                   caption: '',
                                   credit: '',
                                   tags: []
                                  };

              Media.insert(newFile, function (err, fileObj) {
                  if(err) {
                      Validation.set_error("One or more files are invalid or too large.");
                  } else {
                     if(count >= qty) {
                       next();
                     }
                  }
                });
          }
      });
    }
};
