Media.allow({
      insert: function(userId) {
        return true;
      },
      update: function(userId) {
        return true;
      },
      remove: function(userId) {
        return true;
      },
      download: function(userId) {
        return true;
      },
      fetch: []
    });

 Meteor.publish("media", function(options) {
      //if (Authorize.isAdmin) {
      return Media.find({}, options, { fields: {"copies.default": 0}});
 });

 Meteor.publish("galleryMedia", function(galleryId) {
      //if (Authorize.isAdmin) {
      var gallery = Galleries.findOne(galleryId);
      var content = gallery.content,
          images = [];

      _.each(content, function (c) {
          images.push(c.id);
      });

      return Media.find({ _id: { $in: images }}, { fields: {"copies.default": 0, "copies.thumb": 0, "original": 0}});
 });

Meteor.methods({
      uploadMedia: function(asset) {
        Media.insert(asset, function (err, fileObj) { 
          if(err) Meteor._debug(err); 
          else Meteor._debug(fileObj._id);
        });   
      },
      removeAssets: function(assets) {
        Media.remove({_id: { $in: assets }});
      },
      updateMedia: function(options) {
        // if(!Meteor.user())
        //   throw new Meteor.Error();
        gm(200, 400, "#ddff99f3").drawText(10, 50, "from scratch").write("/watermarks/newimg.jpg", function (err) {});


        var fileObj = Media.findOne(options.id);

        var readStream = fileObj.createReadStream('default');

        var writeStream = fileObj.createWriteStream('image_md');
        gm(readStream, fileObj.name({store: 'default'})).drawText(20, 20, 'Copyright', 'center').stream().pipe(writeStream);
      }
});

   

