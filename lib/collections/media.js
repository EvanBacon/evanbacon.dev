// three stores: 
// thumbStore: thumbnails
// largeStore: large images for display purposes (carousel, popups etc)
// imageStore: original images to be used to produce a new large image if the image is manipulated (e.g. watermarking)



// function to resize incoming images based on longest side
var resizeImage = function (w, h, max) {
  if (w > max || h > max) {
    var ratio = w / h;
    if (w > h) {
        w = max;
        h = Math.floor(w / ratio);
    } else {
        h = max;
        w = Math.floor(h * ratio); 
    }
  }

  return {width: w, height: h};
};

var thumbStore = new FS.Store.GridFS("thumb", {
    beforeWrite: function(fileObj) {
      // append -thumb to file name
      var newName = MediaLibrary.appendToFileName(fileObj.name().toLowerCase(), '-thumb'); 
      return {
        name: newName
      }   
    },
    transformWrite: function(fileObj, readStream, writeStream) {
      // convert to png
      fileObj.extension('png', {store: 'thumb'});
      fileObj.type('image/png', {store: 'thumb'});
      var transformer = gm(readStream, fileObj.name({store: 'thumb'}));
      transformer.size({bufferStream: true}, FS.Utility.safeCallback(function (err, size) {
        if (!err) {
          var newSize = resizeImage(size.width, size.height, getSetting('imageWidthThumb', 250)),
              width = newSize.width,
              height = newSize.height,
              cropLen = (width - height) > 0 ? height : width, // choose shortest side's length
              x = (width / 2) - (cropLen / 2),
              y = (height / 2) - (cropLen / 2);
          
          transformer.resize(width, height).autoOrient().quality(60).crop(cropLen, cropLen, x, y).stream('PNG').pipe(writeStream);

          // save dimensions
          fileObj.update({$set: {'metadata.widthTmb': width, 'metadata.heightTmb': height}});
        }

      }));
      
    },
    maxTries: 2
  });

// store for images in their original form
// shrinks images if exceed maximum width or height as specified by settings
var imageStore = new FS.Store.GridFS("default", { 
      beforeWrite: function(fileObj) {
          // Change the filename to lowercase
        var newName = fileObj.name().toLowerCase(); 
        return {
          name: newName
        }       
      },
      transformWrite: function (fileObj, readStream, writeStream) {
        
        var transformer = gm(readStream, fileObj.name({store: 'default'}));
        
        transformer.size({bufferStream: true}, FS.Utility.safeCallback(function (err, size) {
          if (!err) {
            var newSize = resizeImage(size.width, size.height, getSetting('imageWidthMax', 1400));
            var width = newSize.width;
            var height = newSize.height;

            transformer.resize(width, height).autoOrient().stream().pipe(writeStream);

            // save dimensions
            fileObj.update({$set: {'metadata.width': width, 'metadata.height': height}});
          } 
        }));
      },
      maxTries: 2
    }
  );

var largeStore = new FS.Store.GridFS("image_lg",  {
    beforeWrite: function(fileObj) {
          // change the filename to lowercase
        var newName = MediaLibrary.appendToFileName(fileObj.name().toLowerCase(), '-lg');
        return {
          name: newName
        }       
    },
    transformWrite: function(fileObj, readStream, writeStream) {
      var transformer = gm(readStream, fileObj.name({store: 'image_lg'}));
      transformer.size({bufferStream: true}, FS.Utility.safeCallback(function (err, size) {
        if (!err) {
          
            var width = size.width;
            var height = size.height;
            var lgWidth = getSetting('imageWidthLarge', 800);

            if(width > lgWidth || height > lgWidth) {
                var newSize = resizeImage(width, height, lgWidth);
                width = newSize.width;
                height = newSize.height;
            }
            
            transformer.resize(width, height).autoOrient().quality(60).stream().pipe(writeStream);

            // save dimensions
            fileObj.update({$set: {'metadata.widthLg': width, 'metadata.heightLg': height}});
            
          } 

      }));
      
    },
    maxTries: 2
  }
);

var mediumStore = new FS.Store.GridFS("image_md",  {
    beforeWrite: function(fileObj) {
          // change the filename to lowercase
        var newName = MediaLibrary.appendToFileName(fileObj.name().toLowerCase(), '-md');
        return {
          name: newName
        }       
    },
    transformWrite: function(fileObj, readStream, writeStream) {
      var transformer = gm(readStream, fileObj.name({store: 'image_md'}));
      transformer.size({bufferStream: true}, FS.Utility.safeCallback(function (err, size) {
        if (!err) {
          
            var width = size.width;
            var height = size.height;
            var mdWidth = getSetting('imageWidthMedium', 450);

            if(width > mdWidth || height > mdWidth) {
                var newSize = resizeImage(width, height, mdWidth);
                width = newSize.width;
                height = newSize.height;
            }
            
            transformer.resize(width, height).autoOrient().quality(60).stream().pipe(writeStream);
            fileObj.update({$set: {'metadata.widthMd': width, 'metadata.heightMd': height}});
            
          } 

      }));
      
    },
    maxTries: 2
  }
);

// set the image path (just removing 'cfs')
FS.HTTP.setBaseUrl('');

Media = new FS.Collection("media", {
      stores: [
        thumbStore,
        imageStore,
        largeStore,
        mediumStore
      ],
      filter: {
        maxSize: getSetting('imageMaxSize', 1000000), //in bytes (1 Mb)
        allow: {
          contentTypes: ['image/*'] 
        },
        // onInvalid: function (message) {
        //   alert("One or more files are invalid or too large.")
        //   // throw new Meteor.Error(413, "Invalid file or file too large."); 
        // }
      }
    });
